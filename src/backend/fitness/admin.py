from django.contrib import admin
from .models import Exercise, WorkoutTemplate, WorkoutExercise, BodyMetrics

admin.site.register(Exercise)
admin.site.register(WorkoutTemplate)
admin.site.register(WorkoutExercise)
admin.site.register(BodyMetrics)
