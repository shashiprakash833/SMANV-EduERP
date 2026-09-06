from django.contrib import admin
from .models import ClassSession, Assignment

@admin.register(ClassSession)
class ClassSessionAdmin(admin.ModelAdmin):
    list_display = ['period', 'subject', 'grade', 'section', 'teacher_name', 'room', 'organization']
    list_filter = ['grade', 'section', 'organization']

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ['title', 'subject', 'grade', 'section', 'due_date', 'status', 'organization']
    list_filter = ['grade', 'status', 'organization']
