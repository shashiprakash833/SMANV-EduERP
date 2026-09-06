from rest_framework import serializers
from .models import AIInsight

class AIInsightSerializer(serializers.ModelSerializer):
    actionText = serializers.CharField(source='action_text', read_only=True)
    actionRoute = serializers.CharField(source='action_route', read_only=True)

    class Meta:
        model = AIInsight
        fields = [
            'id', 'title', 'type', 'severity', 'description',
            'recommendation', 'metric', 'action_text', 'actionText',
            'action_route', 'actionRoute'
        ]

class AIChatSerializer(serializers.Serializer):
    message = serializers.CharField()
    context = serializers.DictField(required=False)
