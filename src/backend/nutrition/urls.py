from django.urls import path
from .views import DailyNutritionView

urlpatterns = [
    path('daily/', DailyNutritionView.as_view(), name='daily-nutrition'),
]
