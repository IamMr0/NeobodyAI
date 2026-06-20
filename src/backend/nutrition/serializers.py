from rest_framework import serializers
from .models import DailyNutrition

class DailyNutritionSerializer(serializers.ModelSerializer):
    ai_insight = serializers.SerializerMethodField()

    class Meta:
        model = DailyNutrition
        fields = ('id', 'user', 'date', 'protein_g', 'carbs_g', 'fats_g', 'kcal_consumed', 'kcal_target', 'ai_insight')
        read_only_fields = ('user', 'date')

    def get_ai_insight(self, obj):
        # We'll just generate the insight on demand in the view and return it,
        # but to keep it simple, we could also store it in the database. 
        # The user wanted to know about trade-offs of storing it in the DB vs on-the-fly.
        # Since we are storing it in the DB, let's update the model in the future if needed.
        # For now, we will return a temporary field that gets populated by the view.
        return getattr(obj, 'ai_insight', None)
