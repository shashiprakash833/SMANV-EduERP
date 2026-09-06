"""Organizations signals."""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Organization

@receiver(post_save, sender=Organization)
def on_organization_created(sender, instance, created, **kwargs):
    if created:
        pass
