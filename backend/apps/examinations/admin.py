from django.contrib import admin
from .models import Examination, ExamResult

@admin.register(Examination)
class ExaminationAdmin(admin.ModelAdmin):
    list_display = ['title', 'subject', 'grade', 'date', 'room', 'max_marks', 'status', 'organization']
    list_filter = ['grade', 'status', 'organization']

@admin.register(ExamResult)
class ExamResultAdmin(admin.ModelAdmin):
    list_display = ['examination', 'student', 'marks_obtained', 'grade_letter']
