from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import AIInsight

@receiver(post_save, sender=AIInsight)
def insight_saved_handler(sender, instance, created, **kwargs):
    pass
