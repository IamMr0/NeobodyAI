from django.urls import path
from .views import BodyMetricsView, ExerciseListView, BodyMetricsTrendsView, AIVolumePlanGeneratorView

urlpatterns = [
    path('body-metrics/', BodyMetricsView.as_view(), name='body-metrics'),
    path('exercises/', ExerciseListView.as_view(), name='exercises'),
    path('trends/', BodyMetricsTrendsView.as_view(), name='body-metrics-trends'),
    path('generate-plan/', AIVolumePlanGeneratorView.as_view(), name='ai-generate-plan'),
]
