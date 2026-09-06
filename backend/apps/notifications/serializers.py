from rest_framework import serializers
from .models import NotificationItem

class NotificationItemSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(source='created_at', read_only=True)
    isRead = serializers.BooleanField(source='is_read', read_only=True)
    actionRoute = serializers.CharField(source='action_route', read_only=True)

    class Meta:
        model = NotificationItem
        fields = [
            'id', 'title', 'message', 'category', 'timestamp', 'is_read',
            'isRead', 'priority', 'action_route', 'actionRoute'
        ]
