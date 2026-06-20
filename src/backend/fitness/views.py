from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import BodyMetrics
from .serializers import BodyMetricsSerializer
from rag.services import generate_body_insight

class BodyMetricsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        latest = BodyMetrics.objects.filter(user=request.user).order_by('-date_recorded').first()
        if not latest:
            return Response(None)
        return Response(BodyMetricsSerializer(latest).data)

    def post(self, request):
        serializer = BodyMetricsSerializer(data=request.data)
        if serializer.is_valid():
            # Synchronously generate insight using Gemini
            insight = generate_body_insight(
                user=request.user,
                weight=serializer.validated_data.get('weight_kg'),
                body_fat=serializer.validated_data.get('body_fat_percentage'),
                muscle_mass=serializer.validated_data.get('muscle_mass_kg')
            )
            
            # Save the object
            serializer.save(user=request.user, metabolic_insight=insight)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
