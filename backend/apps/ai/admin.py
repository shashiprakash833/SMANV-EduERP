from django.contrib import admin
from .models import AIInsight

@admin.register(AIInsight)
class AIInsightAdmin(admin.ModelAdmin):
    list_display = ['title', 'type', 'severity', 'metric', 'organization', 'created_at']
    list_filter = ['type', 'severity', 'organization']
