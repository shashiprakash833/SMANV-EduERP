from django.contrib import admin
from .models import ReportMetric

@admin.register(ReportMetric)
class ReportMetricAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'value', 'change', 'trend', 'organization']
    list_filter = ['category', 'trend', 'organization']
