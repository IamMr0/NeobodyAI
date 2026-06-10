from django.db import models
from django.conf import settings

class DailyNutrition(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='nutrition_logs')
    date = models.DateField()
    protein_g = models.DecimalField(max_digits=5, decimal_places=1, default=0)
    carbs_g = models.DecimalField(max_digits=5, decimal_places=1, default=0)
    fats_g = models.DecimalField(max_digits=5, decimal_places=1, default=0)
    kcal_consumed = models.IntegerField(default=0)
    kcal_target = models.IntegerField(default=2000)

    class Meta:
        unique_together = ('user', 'date')

    def __str__(self):
        return f"{self.user.username} - {self.date}"

class HydrationLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='hydration_logs')
    date = models.DateField()
    amount_ml = models.IntegerField(default=0)

    class Meta:
        unique_together = ('user', 'date')

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.amount_ml}ml"
