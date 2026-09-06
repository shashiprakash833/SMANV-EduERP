from rest_framework import serializers
from .models import ReportMetric

class ReportMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportMetric
        fields = ['id', 'title', 'category', 'value', 'change', 'trend', 'period']
