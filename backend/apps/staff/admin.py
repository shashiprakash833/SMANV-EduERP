from django.contrib import admin
from .models import Staff

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ['name', 'employee_code', 'department', 'designation', 'status', 'attendance_rate', 'organization']
    list_filter = ['department', 'status', 'organization']
    search_fields = ['name', 'employee_code', 'email', 'phone']
