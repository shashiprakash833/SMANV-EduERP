from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = [
        'email',
        'first_name',
        'last_name',
        'role',
        'organization',
        'mobile',
        'is_active',
        'is_verified',
        'created_at',
    ]
    list_filter = [
        'role',
        'is_active',
        'is_verified',
        'is_staff',
        'organization',
        'created_at',
    ]
    search_fields = [
        'email',
        'first_name',
        'last_name',
        'mobile',
        'organization__name',
    ]
    ordering = ['-created_at']
    readonly_fields = ['id', 'created_at', 'updated_at']

    fieldsets = (
        ('Authentication', {
            'fields': ('id', 'email', 'password')
        }),
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'mobile', 'profile_photo')
        }),
        ('Role & Tenant Organization', {
            'fields': ('role', 'organization', 'designation', 'department')
        }),
        ('Student / Academic Context', {
            'fields': ('student_id', 'grade', 'section'),
            'classes': ('collapse',)
        }),
        ('Permissions & Status', {
            'fields': ('is_active', 'is_verified', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Important Dates', {
            'fields': ('last_login', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'role', 'organization', 'password'),
        }),
    )
