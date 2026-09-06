from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Examination

@receiver(post_save, sender=Examination)
def exam_saved_handler(sender, instance, created, **kwargs):
    pass
