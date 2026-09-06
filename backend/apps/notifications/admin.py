from django.contrib import admin
from .models import NotificationItem

@admin.register(NotificationItem)
class NotificationItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'priority', 'is_read', 'created_at', 'organization']
    list_filter = ['category', 'priority', 'is_read', 'organization']
    search_fields = ['title', 'message']
