from django.db import migrations

def seed_exercises(apps, schema_editor):
    Exercise = apps.get_model('fitness', 'Exercise')
    exercises_data = [
        {
            'name': 'Barbell Bench Press',
            'equipment': 'Barbell',
            'muscle_groups': ['Chest', 'Triceps', 'Shoulders'],
            'instructions': 'Lie flat on a bench, grip the barbell slightly wider than shoulder width, lower it to your chest, and push it back up.',
            'ai_insight': 'Keep your feet planted on the floor and retract your scapula to protect your shoulders.'
        },
        {
            'name': 'Barbell Back Squat',
            'equipment': 'Barbell',
            'muscle_groups': ['Quadriceps', 'Glutes', 'Hamstrings'],
            'instructions': 'Place the barbell on your upper back, stand with feet shoulder-width apart, bend knees and hips to lower your body, then push back to starting position.',
            'ai_insight': 'Ensure your knees track in line with your toes and maintain a neutral spine throughout the lift.'
        },
        {
            'name': 'Conventional Deadlift',
            'equipment': 'Barbell',
            'muscle_groups': ['Hamstrings', 'Glutes', 'Lower Back', 'Lats'],
            'instructions': 'Stand with mid-foot under the bar, bend over and grab the bar with shoulder-width grip, bend knees until shins touch the bar, lift your chest, and stand up with the weight.',
            'ai_insight': 'Do not round your lower back. Keep the bar path close to your legs and drive through your heels.'
        },
        {
            'name': 'Bodyweight Pull-up',
            'equipment': 'Bodyweight',
            'muscle_groups': ['Lats', 'Biceps', 'Upper Back'],
            'instructions': 'Hang from a bar with a wide overhand grip, pull your chest up to the bar, then lower yourself slowly.',
            'ai_insight': 'Focus on pulling through your elbows and squeeze your shoulder blades at the top for maximum lat activation.'
        },
        {
            'name': 'Dumbbell Bicep Curl',
            'equipment': 'Dumbbells',
            'muscle_groups': ['Biceps', 'Forearms'],
            'instructions': 'Stand holding dumbbells at your sides, keep elbows close to your torso, curl the weights while contracting your biceps, then lower them.',
            'ai_insight': 'Avoid using momentum or swinging your body. Control the eccentric phase for optimal muscle hypertrophy.'
        },
        {
            'name': 'Standard Pushup',
            'equipment': 'Bodyweight',
            'muscle_groups': ['Chest', 'Triceps', 'Shoulders', 'Core'],
            'instructions': 'Start in a plank position, lower your chest until it nearly touches the floor, then push back up.',
            'ai_insight': 'Keep your elbows tucked at roughly 45 degrees and engage your core to prevent your hips from sagging.'
        },
        {
            'name': 'Dumbbell Shoulder Press',
            'equipment': 'Dumbbells',
            'muscle_groups': ['Shoulders', 'Triceps'],
            'instructions': 'Sit or stand with dumbbells at shoulder height, push the weights straight up overhead, then lower them back down.',
            'ai_insight': 'Do not arch your lower back excessively at the top. Keep your core braced.'
        },
        {
            'name': 'Kettlebell Swing',
            'equipment': 'Kettlebell',
            'muscle_groups': ['Glutes', 'Hamstrings', 'Lower Back', 'Shoulders'],
            'instructions': 'Hinge at your hips, swing the kettlebell between your legs, then snap your hips forward to swing it to chest height.',
            'ai_insight': 'This is a hinge movement, not a squat. Power the swing using your glutes and hamstrings.'
        }
    ]
    for ex_data in exercises_data:
        Exercise.objects.get_or_create(
            name=ex_data['name'],
            defaults={
                'equipment': ex_data['equipment'],
                'muscle_groups': ex_data['muscle_groups'],
                'instructions': ex_data['instructions'],
                'ai_insight': ex_data['ai_insight']
            }
        )

def remove_exercises(apps, schema_editor):
    Exercise = apps.get_model('fitness', 'Exercise')
    Exercise.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('fitness', '0002_initial'),
    ]

    operations = [
        migrations.RunPython(seed_exercises, remove_exercises),
    ]
