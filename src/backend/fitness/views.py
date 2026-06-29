from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import BodyMetrics, Exercise
from .serializers import BodyMetricsSerializer, ExerciseSerializer
from rag.services import generate_body_insight

class BodyMetricsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        latest = BodyMetrics.objects.filter(user=request.user).order_by('-date_recorded').first()
        if not latest:
            return Response(None)
        return Response(BodyMetricsSerializer(latest).data)

    def post(self, request):
        serializer = BodyMetricsSerializer(data=request.data)
        if serializer.is_valid():
            # Synchronously generate insight using Gemini
            insight = generate_body_insight(
                user=request.user,
                weight=serializer.validated_data.get('weight_kg'),
                body_fat=serializer.validated_data.get('body_fat_percentage'),
                muscle_mass=serializer.validated_data.get('muscle_mass_kg')
            )
            
            # Save the object
            serializer.save(user=request.user, metabolic_insight=insight)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class ExerciseListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        exercises = Exercise.objects.all()
        serializer = ExerciseSerializer(exercises, many=True)
        return Response(serializer.data)

class BodyMetricsTrendsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        metrics = BodyMetrics.objects.filter(user=request.user).order_by('date_recorded')
        
        if not metrics.exists():
            return Response({
                'historical_data': [],
                'projection': None,
                'physiological_stats': None
            })
            
        latest = metrics.last()
        latest_weight = float(latest.weight_kg)
        bmr = int(10 * latest_weight + 6.25 * 175 - 5 * 25 + 5)
        
        ffmi = None
        ffmi_class = "Awaiting body fat %"
        if latest.body_fat_percentage:
            body_fat = float(latest.body_fat_percentage)
            lean_mass = latest_weight * (1 - body_fat / 100)
            ffmi = round(lean_mass / (1.75 ** 2), 2)
            if ffmi < 18:
                ffmi_class = "Below Average"
            elif ffmi < 20:
                ffmi_class = "Average"
            elif ffmi < 22:
                ffmi_class = "Above Average"
            elif ffmi < 25:
                ffmi_class = "Excellent / Athletic"
            else:
                ffmi_class = "Superior / Highly Muscular"
                
        projection = None
        if metrics.count() >= 2:
            try:
                x0 = metrics.first().date_recorded
                x_vals = [(m.date_recorded - x0).days for m in metrics]
                y_w = [float(m.weight_kg) for m in metrics]
                
                N = len(x_vals)
                sum_x = sum(x_vals)
                sum_y_w = sum(y_w)
                sum_xx = sum(x ** 2 for x in x_vals)
                sum_xy_w = sum(x * y for x, y in zip(x_vals, y_w))
                
                denom = (N * sum_xx) - (sum_x ** 2)
                if denom != 0:
                    slope_w = (N * sum_xy_w - sum_x * sum_y_w) / denom
                    intercept_w = (sum_y_w - slope_w * sum_x) / N
                    
                    latest_x = x_vals[-1]
                    forecast_x = latest_x + 30
                    projected_weight = round(slope_w * forecast_x + intercept_w, 1)
                    weight_diff = round(projected_weight - latest_weight, 1)
                    
                    projected_fat = None
                    fat_diff = None
                    y_f = [float(m.body_fat_percentage) for m in metrics if m.body_fat_percentage is not None]
                    if len(y_f) == N:
                        sum_y_f = sum(y_f)
                        sum_xy_f = sum(x * y for x, y in zip(x_vals, y_f))
                        slope_f = (N * sum_xy_f - sum_x * sum_y_f) / denom
                        intercept_f = (sum_y_f - slope_f * sum_x) / N
                        projected_fat = round(slope_f * forecast_x + intercept_f, 1)
                        if projected_fat < 3.0:
                            projected_fat = 3.0
                        latest_fat = float(latest.body_fat_percentage)
                        fat_diff = round(projected_fat - latest_fat, 1)
                        
                    projection = {
                        'weight_in_30_days': projected_weight,
                        'weight_change': weight_diff,
                        'body_fat_in_30_days': projected_fat,
                        'body_fat_change': fat_diff,
                    }
            except Exception as reg_err:
                print(f"Regression calculation failed: {reg_err}")
                
        historical_data = [{
            'date': m.date_recorded.strftime('%Y-%m-%d'),
            'weight': float(m.weight_kg),
            'body_fat': float(m.body_fat_percentage) if m.body_fat_percentage else None,
            'muscle_mass': float(m.muscle_mass_kg) if m.muscle_mass_kg else None,
        } for m in metrics]
        
        return Response({
            'historical_data': historical_data,
            'projection': projection,
            'physiological_stats': {
                'bmr': bmr,
                'ffmi': ffmi,
                'ffmi_class': ffmi_class
            }
        })

class AIVolumePlanGeneratorView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        goal = request.data.get('goal', 'Hypertrophy')
        experience_level = request.data.get('experience_level', 'Intermediate')
        
        # Retrieve latest metrics for context
        latest_metrics = BodyMetrics.objects.filter(user=request.user).order_by('-date_recorded').first()
        weight = float(latest_metrics.weight_kg) if latest_metrics else 75.0
        muscle_mass = float(latest_metrics.muscle_mass_kg) if latest_metrics and latest_metrics.muscle_mass_kg else 35.0
        
        # Decision-Tree heuristic classifications
        # 1. Classify weekly set volume and intensity based on experience level
        if experience_level == 'Beginner':
            sets = 3
            intensity = 'RPE 7 (3 reps in reserve)'
            rest = '90-120 seconds'
        elif experience_level == 'Advanced':
            sets = 5
            intensity = 'RPE 9-10 (0-1 reps in reserve)'
            rest = '3-5 minutes for compounds, 90s for accessories'
        else: # Intermediate default
            sets = 4
            intensity = 'RPE 8 (2 reps in reserve)'
            rest = '2-3 minutes for compounds, 60-90s for accessories'
            
        # 2. Classify exercise selection and rep ranges based on target goal
        if goal == 'Strength':
            rep_range = '4-6 reps'
            target_exercises = ['Barbell Bench Press', 'Barbell Back Squat', 'Conventional Deadlift', 'Dumbbell Shoulder Press']
            goal_desc = 'mechanical tension and neuromuscular recruitment'
        elif goal == 'Endurance':
            rep_range = '15-20 reps'
            target_exercises = ['Standard Pushup', 'Bodyweight Pull-up', 'Kettlebell Swing', 'Barbell Back Squat']
            goal_desc = 'mitochondrial density and metabolic fatigue'
        else: # Hypertrophy default
            rep_range = '8-12 reps'
            target_exercises = ['Barbell Bench Press', 'Barbell Back Squat', 'Bodyweight Pull-up', 'Dumbbell Bicep Curl', 'Dumbbell Shoulder Press']
            goal_desc = 'myofibrillar hypertrophy and sarcoplasmic volume'

        # Query actual seeded exercises from DB
        db_exercises = {ex.name: ex for ex in Exercise.objects.filter(name__in=target_exercises)}
        
        # Assemble routine exercises
        routine_exercises = []
        for name in target_exercises:
            if name in db_exercises:
                ex = db_exercises[name]
                routine_exercises.append({
                    'name': ex.name,
                    'sets': sets,
                    'reps': rep_range,
                    'intensity': intensity,
                    'rest': rest,
                    'equipment': ex.equipment,
                    'muscle_groups': ex.muscle_groups
                })
            else:
                # Fallback in case DB is not yet seeded
                fallback_equipment = 'Barbell'
                fallback_muscles = ['Full Body']
                if 'Pushup' in name or 'Pull-up' in name:
                    fallback_equipment = 'Bodyweight'
                elif 'Dumbbell' in name:
                    fallback_equipment = 'Dumbbells'
                
                if 'Squat' in name:
                    fallback_muscles = ['Legs', 'Glutes']
                elif 'Bench Press' in name or 'Pushup' in name:
                    fallback_muscles = ['Chest', 'Triceps']
                elif 'Bicep' in name or 'Pull-up' in name:
                    fallback_muscles = ['Back', 'Biceps']
                
                routine_exercises.append({
                    'name': name,
                    'sets': sets,
                    'reps': rep_range,
                    'intensity': intensity,
                    'rest': rest,
                    'equipment': fallback_equipment,
                    'muscle_groups': fallback_muscles
                })

        # Calculate total load recommendation
        intensity_mult = 0.85 if goal == 'Strength' else (0.75 if goal == 'Hypertrophy' else 0.50)
        target_load = round(weight * intensity_mult, 1)
        
        # Generate custom biomechanic comment incorporating user metrics
        insight = (
            f"Optimized weekly routine designed for user profile ({weight} kg, muscle mass: {muscle_mass} kg). "
            f"Targeting {goal_desc} using {sets} working sets per movement. "
            f"Based on your body weight, your projected working load for major compound movements is approximately {target_load} kg. "
            f"Maintain {rest} of rest between sets to allow full ATP resynthesis."
        )

        return Response({
            'routine_name': f"AI {experience_level} {goal} Routine",
            'exercises': routine_exercises,
            'ai_optimization_insight': insight
        })
