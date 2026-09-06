from django.contrib import admin
from .models import Organization

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'type',
        'code',
        'status',
        'subscription_plan',
        'city',
        'state',
        'student_count',
        'staff_count',
        'created_at',
    ]
    list_filter = [
        'type',
        'status',
        'subscription_plan',
        'state',
        'created_at',
    ]
    search_fields = [
        'name',
        'code',
        'email',
        'phone',
        'city',
        'state',
    ]
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['name']
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'name', 'type', 'code', 'logo')
        }),
        ('Status & Plan', {
            'fields': ('status', 'subscription_plan')
        }),
        ('Contact Details', {
            'fields': ('email', 'phone', 'address', 'city', 'state', 'pincode')
        }),
        ('Academic & Institutional Stats', {
            'fields': ('academic_year', 'established_year', 'student_count', 'staff_count')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
