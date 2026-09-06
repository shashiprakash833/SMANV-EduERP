from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import FeeRecord

@receiver(post_save, sender=FeeRecord)
def fee_record_saved_handler(sender, instance, created, **kwargs):
    pass
