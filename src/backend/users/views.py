from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserProfileSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user

class AdminDashboardStatsView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        total_users = User.objects.count()
        # Mock upgraded users for now or check some field. Let's just say users joined in last 30 days are active or we just use is_active
        active_users = User.objects.filter(is_active=True).count()
        # Mock upgraded users to be 10% of active for now, since we don't have a subscription field
        upgraded_users = int(active_users * 0.1) if active_users > 0 else 0
        
        return Response({
            'total_users': total_users,
            'active_users': active_users,
            'upgraded_users': upgraded_users,
        })

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    permission_classes = (IsAdminUser,)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            from .serializers import AdminUserCreateSerializer
            return AdminUserCreateSerializer
        from .serializers import AdminUserSerializer
        return AdminUserSerializer

class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    permission_classes = (IsAdminUser,)
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            from .serializers import AdminUserCreateSerializer
            return AdminUserCreateSerializer
        from .serializers import AdminUserSerializer
        return AdminUserSerializer
