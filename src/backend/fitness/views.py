from django.db import models
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
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

class ExercisePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class ExerciseListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = Exercise.objects.all().order_by('id')
        
        # Filtering
        equipment = request.query_params.get('equipment')
        if equipment:
            queryset = queryset.filter(equipment__iexact=equipment)
            
        category = request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__iexact=category)
            
        body_part = request.query_params.get('body_part')
        if body_part:
            queryset = queryset.filter(body_part__iexact=body_part)
            
        search = request.query_params.get('search')
        if search:
            # Search in name or instructions
            queryset = queryset.filter(
                models.Q(name__icontains=search) | 
                models.Q(instructions__icontains=search)
            )
            
        paginator = ExercisePagination()
        page = paginator.paginate_queryset(queryset, request, view=self)
        if page is not None:
            serializer = ExerciseSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
            
        serializer = ExerciseSerializer(queryset, many=True)
        return Response(serializer.data)

class ExerciseFiltersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = Exercise.objects.values_list('category', flat=True).distinct()
        body_parts = Exercise.objects.values_list('body_part', flat=True).distinct()
        equipments = Exercise.objects.values_list('equipment', flat=True).distinct()
        
        clean_categories = sorted(list(set(c.strip().title() for c in categories if c)))
        clean_body_parts = sorted(list(set(bp.strip().title() for bp in body_parts if bp)))
        clean_equipments = sorted(list(set(e.strip().title() for e in equipments if e)))
        
        return Response({
            'categories': clean_categories,
            'body_parts': clean_body_parts,
            'equipments': clean_equipments
        })

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
        gender = request.data.get('gender', 'Male')
        fitness_status = request.data.get('fitness_status', 'General Fitness')
        days_per_week = int(request.data.get('days_per_week', 4))
        
        # Retrieve latest metrics for context
        latest_metrics = BodyMetrics.objects.filter(user=request.user).order_by('-date_recorded').first()
        weight = float(latest_metrics.weight_kg) if latest_metrics else 75.0
        muscle_mass = float(latest_metrics.muscle_mass_kg) if latest_metrics and latest_metrics.muscle_mass_kg else 35.0
        
        # Decision-Tree heuristic classifications
        # 1. Base sets, intensity and rest on experience level
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
            
        # 2. Refine based on fitness_status
        status_note = ""
        if fitness_status == 'Newbie':
            sets = max(2, sets - 1)
            intensity = 'RPE 6 (focused on safe form execution)'
            status_note = "Form adaptation priority. Start light."
        elif fitness_status == 'Recovering from Injury':
            sets = 2
            intensity = 'RPE 5 (active recovery / rehabilitation)'
            rest = '2-3 minutes (extended rest for joint decompression)'
            status_note = "Injury protocol: maintain light tension, avoid spinal load."
        elif fitness_status == 'Active Athlete':
            sets = min(5, sets + 1)
            status_note = "Athlete protocol: heightened capacity for volume and recovery."

        # 3. Base exercise selection on goal
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

        # 4. Modify exercises for special conditions (Injury / Gender)
        if fitness_status == 'Recovering from Injury':
            # Swap heavy spine loaders
            target_exercises = [ex.replace('Barbell Back Squat', 'Goblet Squat (Light)').replace('Conventional Deadlift', 'Kettlebell Swing') for ex in target_exercises]
        
        if gender == 'Female':
            # Highlight posterior chain / lower body adaptation
            target_exercises = [ex.replace('Barbell Back Squat', 'Barbell Back Squat (Glute Focus)') for ex in target_exercises]

        # Query actual seeded exercises from DB (ignoring glute-focus suffix for query matching)
        db_exercises = {ex.name: ex for ex in Exercise.objects.filter(name__in=[name.split(' (')[0] for name in target_exercises])}
        
        # Assemble routine exercises
        routine_exercises = []
        for name in target_exercises:
            base_name = name.split(' (')[0]
            if base_name in db_exercises:
                ex = db_exercises[base_name]
                routine_exercises.append({
                    'name': name,
                    'sets': sets,
                    'reps': rep_range,
                    'intensity': intensity,
                    'rest': rest,
                    'equipment': ex.equipment,
                    'muscle_groups': ex.muscle_groups
                })
            else:
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
        gender_mult = 0.95 if gender == 'Female' else 1.0
        intensity_mult = 0.85 if goal == 'Strength' else (0.75 if goal == 'Hypertrophy' else 0.50)
        target_load = round(weight * intensity_mult * gender_mult, 1)
        
        total_weekly_sets = len(target_exercises) * sets * days_per_week
        
        insight = (
            f"Optimized weekly routine designed for user profile ({gender}, {weight} kg, muscle mass: {muscle_mass} kg). "
            f"Targeting {goal_desc} using {sets} working sets per movement. "
            f"Working load recommendation: approximately {target_load} kg. "
            f"Given your frequency of {days_per_week} days/week, your weekly volume accumulates to {total_weekly_sets} sets. "
            f"Split this work to allow 48-72 hours of recovery for major muscle groups. {status_note}"
        )

        return Response({
            'routine_name': f"AI {experience_level} {goal} Routine ({fitness_status})",
            'exercises': routine_exercises,
            'ai_optimization_insight': insight
        })

class BodyScanView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        image_base64 = request.data.get('image')
        if not image_base64:
            return Response({'error': 'Image payload is required'}, status=400)
            
        latest = BodyMetrics.objects.filter(user=request.user).order_by('-date_recorded').first()
        weight = float(latest.weight_kg) if latest else 75.0
        
        try:
            from rag.services import get_groq_client
            from django.conf import settings
            client = get_groq_client()
            
            prompt = (
                f"You are IRON AI, a Neubrutalist, high-energy fitness assistant.\n"
                f"Analyze this user physique/posture image.\n"
                f"Weight is approximately {weight} kg.\n"
                f"Provide a detailed posture assessment (e.g. shoulder alignment, spinal curvature cues, lateral balance), "
                f"estimated body fat category (lean, average, overfat), and actionable recommendations for corrective training.\n"
                f"Use a professional, no-nonsense coaching tone. Limit response to 3-4 concise, impactful sentences."
            )
            
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": image_base64,
                                },
                            },
                        ],
                    }
                ],
                model=settings.GROQ_VISION_MODEL
            )
            
            feedback = chat_completion.choices[0].message.content.strip()
            
            # Save this feedback to the latest metrics if available
            if latest:
                latest.metabolic_insight = f"[Physique Scan Feedback]:\n{feedback}\n\n[Previous Insight]:\n{latest.metabolic_insight or ''}"
                latest.save()
            else:
                # Create a fallback metrics entry if none exists
                latest = BodyMetrics.objects.create(
                    user=request.user,
                    weight_kg=75.0,
                    metabolic_insight=f"[Physique Scan Feedback]:\n{feedback}"
                )
                
            return Response({
                'feedback': feedback,
                'latest_metrics': BodyMetricsSerializer(latest).data
            })
        except Exception as e:
            print(f"Error during body scan: {e}")
            return Response({'error': 'Failed to process posture scan. Make sure vision model is active.'}, status=500)
