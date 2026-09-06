from django.contrib import admin
from .models import FeeRecord

@admin.register(FeeRecord)
class FeeRecordAdmin(admin.ModelAdmin):
    list_display = ['receipt_number', 'student', 'category', 'amount', 'due_date', 'status', 'payment_mode', 'organization']
    list_filter = ['category', 'status', 'payment_mode', 'organization']
    search_fields = ['receipt_number', 'student__name']
