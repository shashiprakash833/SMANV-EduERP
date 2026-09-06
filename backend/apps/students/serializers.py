from rest_framework import serializers
from .models import Student, AdmissionApplication

class StudentSerializer(serializers.ModelSerializer):
    rollNumber = serializers.CharField(source='roll_number', read_only=True)
    bloodGroup = serializers.CharField(source='blood_group', read_only=True)
    parentName = serializers.CharField(source='parent_name', read_only=True)
    parentPhone = serializers.CharField(source='parent_phone', read_only=True)
    parentEmail = serializers.CharField(source='parent_email', read_only=True)
    attendanceRate = serializers.FloatField(source='attendance_rate', read_only=True)
    feeStatus = serializers.CharField(source='fee_status', read_only=True)
    pendingAmount = serializers.DecimalField(source='pending_amount', max_digits=10, decimal_places=2, read_only=True)
    qrCode = serializers.CharField(source='qr_code', read_only=True)

    class Meta:
        model = Student
        fields = [
            'id', 'name', 'roll_number', 'rollNumber', 'grade', 'section',
            'gender', 'dob', 'blood_group', 'bloodGroup', 'parent_name', 'parentName',
            'parent_phone', 'parentPhone', 'parent_email', 'parentEmail',
            'address', 'attendance_rate', 'attendanceRate', 'fee_status', 'feeStatus',
            'pending_amount', 'pendingAmount', 'avatar', 'qr_code', 'qrCode'
        ]

class AdmissionApplicationSerializer(serializers.ModelSerializer):
    applicantName = serializers.CharField(source='applicant_name', read_only=True)
    gradeApplying = serializers.CharField(source='grade_applying', read_only=True)
    parentName = serializers.CharField(source='parent_name', read_only=True)
    parentPhone = serializers.CharField(source='parent_phone', read_only=True)
    appliedDate = serializers.DateField(source='applied_date', read_only=True)
    previousSchool = serializers.CharField(source='previous_school', read_only=True)

    class Meta:
        model = AdmissionApplication
        fields = [
            'id', 'applicant_name', 'applicantName', 'grade_applying', 'gradeApplying',
            'parent_name', 'parentName', 'parent_phone', 'parentPhone',
            'applied_date', 'appliedDate', 'stage', 'previous_school', 'previousSchool', 'notes'
        ]
