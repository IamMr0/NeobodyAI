from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import DailyNutrition
from .serializers import DailyNutritionSerializer
from rag.services import generate_nutrition_insight
from django.utils import timezone

from decimal import Decimal

class DailyNutritionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        nutrition, created = DailyNutrition.objects.get_or_create(user=request.user, date=today)
        return Response(DailyNutritionSerializer(nutrition).data)

    def post(self, request):
        today = timezone.now().date()
        nutrition, created = DailyNutrition.objects.get_or_create(user=request.user, date=today)
        
        # Add the logged macros to today's totals
        nutrition.protein_g += Decimal(str(request.data.get('protein_g', 0) or 0))
        nutrition.carbs_g += Decimal(str(request.data.get('carbs_g', 0) or 0))
        nutrition.fats_g += Decimal(str(request.data.get('fats_g', 0) or 0))
        nutrition.kcal_consumed += int(request.data.get('kcal', 0) or 0)
        nutrition.save()
        
        # Generate insight based on new totals
        insight = generate_nutrition_insight(
            user=request.user,
            protein=nutrition.protein_g,
            carbs=nutrition.carbs_g,
            fats=nutrition.fats_g,
            kcal_consumed=nutrition.kcal_consumed,
            kcal_target=nutrition.kcal_target
        )
        
        # Since we didn't add ai_insight to DailyNutrition model (to avoid migrations), 
        # we attach it dynamically to the response object.
        nutrition.ai_insight = insight
        
        return Response(DailyNutritionSerializer(nutrition).data)
