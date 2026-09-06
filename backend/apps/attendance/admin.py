from django.contrib import admin
from .models import AttendanceRecord

@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ['entity_name', 'entity_type', 'date', 'status', 'grade', 'section', 'organization']
    list_filter = ['status', 'entity_type', 'date', 'grade', 'organization']
    search_fields = ['entity_name', 'remarks']
