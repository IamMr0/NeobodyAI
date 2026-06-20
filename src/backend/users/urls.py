from django.urls import path
from .views import RegisterView, UserProfileView, AdminDashboardStatsView, UserListCreateView, UserRetrieveUpdateDestroyView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', UserProfileView.as_view(), name='me'),
    path('dashboard-stats/', AdminDashboardStatsView.as_view(), name='dashboard_stats'),
    path('manage/', UserListCreateView.as_view(), name='user-list-create'),
    path('manage/<int:pk>/', UserRetrieveUpdateDestroyView.as_view(), name='user-detail'),
]
