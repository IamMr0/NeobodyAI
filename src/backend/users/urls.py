from django.urls import path
from .views import RegisterView, UserProfileView, AdminDashboardStatsView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', UserProfileView.as_view(), name='me'),
    path('dashboard-stats/', AdminDashboardStatsView.as_view(), name='dashboard_stats'),
]
