from rest_framework import serializers
from .models import AttendanceRecord

class AttendanceRecordSerializer(serializers.ModelSerializer):
    entityId = serializers.UUIDField(source='entity_id', read_only=True)
    entityName = serializers.CharField(source='entity_name', read_only=True)
    entityType = serializers.CharField(source='entity_type', read_only=True)
    timeIn = serializers.TimeField(source='time_in', read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = [
            'id', 'entity_id', 'entityId', 'entity_name', 'entityName',
            'entity_type', 'entityType', 'date', 'status', 'grade', 'section',
            'department', 'time_in', 'timeIn', 'remarks'
        ]

class BatchAttendanceSerializer(serializers.Serializer):
    date = serializers.DateField()
    records = serializers.ListField(child=serializers.DictField())
