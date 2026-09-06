from rest_framework import serializers
from .models import Staff

class StaffSerializer(serializers.ModelSerializer):
    employeeCode = serializers.CharField(source='employee_code', read_only=True)
    joiningDate = serializers.DateField(source='joining_date', read_only=True)
    attendanceRate = serializers.FloatField(source='attendance_rate', read_only=True)

    class Meta:
        model = Staff
        fields = [
            'id', 'name', 'employee_code', 'employeeCode', 'department',
            'designation', 'email', 'phone', 'qualification', 'joining_date',
            'joiningDate', 'status', 'attendance_rate', 'attendanceRate', 'subjects', 'avatar'
        ]
