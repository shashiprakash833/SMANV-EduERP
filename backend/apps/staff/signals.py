from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Staff

@receiver(post_save, sender=Staff)
def staff_saved_handler(sender, instance, created, **kwargs):
    if created:
        pass
