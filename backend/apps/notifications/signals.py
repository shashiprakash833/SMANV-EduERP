from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import NotificationItem

@receiver(post_save, sender=NotificationItem)
def notification_saved_handler(sender, instance, created, **kwargs):
    pass
