from rest_framework import serializers
from .models import BodyMetrics

class BodyMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodyMetrics
        fields = ('id', 'user', 'date_recorded', 'weight_kg', 'body_fat_percentage', 'muscle_mass_kg', 'metabolic_insight')
        read_only_fields = ('user', 'date_recorded', 'metabolic_insight')
