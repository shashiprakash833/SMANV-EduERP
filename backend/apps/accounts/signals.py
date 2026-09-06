"""Accounts signals."""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User

@receiver(post_save, sender=User)
def on_user_created(sender, instance, created, **kwargs):
    if created:
        # Placeholder for welcoming dispatch / notifications
        pass
