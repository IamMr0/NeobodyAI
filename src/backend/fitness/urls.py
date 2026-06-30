from django.urls import path
from .views import BodyMetricsView, ExerciseListView, ExerciseFiltersView, BodyMetricsTrendsView, AIVolumePlanGeneratorView, BodyScanView

urlpatterns = [
    path('body-metrics/', BodyMetricsView.as_view(), name='body-metrics'),
    path('exercises/filters/', ExerciseFiltersView.as_view(), name='exercise-filters'),
    path('exercises/', ExerciseListView.as_view(), name='exercises'),
    path('trends/', BodyMetricsTrendsView.as_view(), name='body-metrics-trends'),
    path('generate-plan/', AIVolumePlanGeneratorView.as_view(), name='ai-generate-plan'),
    path('body-scan/', BodyScanView.as_view(), name='ai-body-scan'),
]
