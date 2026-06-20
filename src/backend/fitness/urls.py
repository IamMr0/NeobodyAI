from django.urls import path
from .views import BodyMetricsView

urlpatterns = [
    path('body-metrics/', BodyMetricsView.as_view(), name='body-metrics'),
]
