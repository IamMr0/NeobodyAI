from django.db import models
from django.conf import settings

from pgvector.django import VectorField

class Exercise(models.Model):
    external_id = models.CharField(max_length=50, null=True, blank=True, unique=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100, null=True, blank=True)
    body_part = models.CharField(max_length=100, null=True, blank=True)
    equipment = models.CharField(max_length=255)
    target = models.CharField(max_length=100, null=True, blank=True)
    muscle_group = models.CharField(max_length=100, null=True, blank=True)
    muscle_groups = models.JSONField(default=list) # Keeps backward compatibility
    secondary_muscles = models.JSONField(default=list)
    instructions = models.TextField(blank=True, null=True)
    instruction_steps = models.JSONField(default=list)
    ai_insight = models.TextField(blank=True, null=True)
    embedding = VectorField(dimensions=384, null=True, blank=True)

    def __str__(self):
        return self.name

class WorkoutTemplate(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='workout_templates')
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class WorkoutExercise(models.Model):
    template = models.ForeignKey(WorkoutTemplate, on_delete=models.CASCADE, related_name='exercises')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    order = models.IntegerField(default=0)
    sets = models.IntegerField(default=3)
    reps = models.CharField(max_length=50, default="10")

    class Meta:
        ordering = ['order']

class BodyMetrics(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='body_metrics')
    date_recorded = models.DateTimeField(auto_now_add=True)
    weight_kg = models.DecimalField(max_digits=5, decimal_places=2)
    body_fat_percentage = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    muscle_mass_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    metabolic_insight = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.date_recorded.date()}"
