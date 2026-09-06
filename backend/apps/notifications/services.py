from typing import Dict, Any
from .models import NotificationItem
from apps.organizations.models import Organization
from apps.accounts.models import User

def create_notification(organization: Organization, data: Dict[str, Any], user: User = None) -> NotificationItem:
    return NotificationItem.objects.create(organization=organization, user=user, **data)

def mark_notification_as_read(notification_id: str) -> bool:
    try:
        item = NotificationItem.objects.get(id=notification_id)
        item.is_read = True
        item.save()
        return True
    except NotificationItem.DoesNotExist:
        return False

def mark_all_notifications_as_read(organization_id: str, user: User = None) -> int:
    qs = NotificationItem.objects.filter(organization_id=organization_id, is_read=False)
    if user:
        qs = qs.filter(user=user)
    return qs.update(is_read=True)
