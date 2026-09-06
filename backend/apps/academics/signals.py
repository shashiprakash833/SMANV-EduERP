from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Assignment

@receiver(post_save, sender=Assignment)
def assignment_saved_handler(sender, instance, created, **kwargs):
    pass
