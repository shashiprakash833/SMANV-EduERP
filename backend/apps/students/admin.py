from django.contrib import admin
from .models import Student, AdmissionApplication

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['name', 'roll_number', 'grade', 'section', 'organization', 'fee_status', 'attendance_rate']
    list_filter = ['grade', 'section', 'fee_status', 'organization']
    search_fields = ['name', 'roll_number', 'parent_name', 'parent_phone']

@admin.register(AdmissionApplication)
class AdmissionApplicationAdmin(admin.ModelAdmin):
    list_display = ['applicant_name', 'grade_applying', 'parent_name', 'stage', 'applied_date', 'organization']
    list_filter = ['stage', 'grade_applying', 'organization']
    search_fields = ['applicant_name', 'parent_name', 'parent_phone']
