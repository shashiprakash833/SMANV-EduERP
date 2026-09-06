from typing import Optional
from django.db.models import QuerySet
from .models import NotificationItem

def get_notifications(organization_id: str, unread_only: bool = False) -> QuerySet[NotificationItem]:
    qs = NotificationItem.objects.filter(organization_id=organization_id)
    if unread_only:
        qs = qs.filter(is_read=False)
    return qs
