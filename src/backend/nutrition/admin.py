from django.contrib import admin
from .models import DailyNutrition, HydrationLog

admin.site.register(DailyNutrition)
admin.site.register(HydrationLog)
