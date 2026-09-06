import uuid
from django.db import models
from apps.common.models import TimeStampedModel

class NotificationPriority(models.TextChoices):
    LOW = 'low', 'Low'
    MEDIUM = 'medium', 'Medium'
    HIGH = 'high', 'High'

class NotificationCategory(models.TextChoices):
    ACADEMICS = 'Academics', 'Academics'
    FEES = 'Fees', 'Fees'
    ATTENDANCE = 'Attendance', 'Attendance'
    GENERAL = 'General', 'General'
    AI_ALERTS = 'AI Alerts', 'AI Alerts'

class NotificationItem(TimeStampedModel):
    """User and organization in-app notifications."""
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='notifications',
        null=True,
        blank=True
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    category = models.CharField(max_length=50, choices=NotificationCategory.choices, default=NotificationCategory.GENERAL)
    is_read = models.BooleanField(default=False)
    priority = models.CharField(max_length=20, choices=NotificationPriority.choices, default=NotificationPriority.MEDIUM)
    action_route = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.category}] {self.title}"
