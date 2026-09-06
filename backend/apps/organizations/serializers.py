from rest_framework import serializers
from .models import Organization

class OrganizationSerializer(serializers.ModelSerializer):
    """Full Organization representation matching frontend expectations."""
    logo_url = serializers.CharField(read_only=True)
    studentCount = serializers.IntegerField(source='student_count', read_only=True)
    staffCount = serializers.IntegerField(source='staff_count', read_only=True)
    establishedYear = serializers.IntegerField(source='established_year', read_only=True)
    academicYear = serializers.CharField(source='academic_year', read_only=True)

    class Meta:
        model = Organization
        fields = [
            'id',
            'name',
            'type',
            'code',
            'email',
            'phone',
            'address',
            'city',
            'state',
            'pincode',
            'logo',
            'logo_url',
            'subscription_plan',
            'status',
            'student_count',
            'staff_count',
            'established_year',
            'academic_year',
            'studentCount',
            'staffCount',
            'establishedYear',
            'academicYear',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'status', 'subscription_plan']

class OrganizationUpdateSerializer(serializers.ModelSerializer):
    """Allows updating organization details by Organization Admin or Super Admin."""
    class Meta:
        model = Organization
        fields = [
            'name',
            'type',
            'code',
            'email',
            'phone',
            'address',
            'city',
            'state',
            'pincode',
            'logo',
            'established_year',
            'academic_year',
        ]
