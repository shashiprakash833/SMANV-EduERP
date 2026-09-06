from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Student

@receiver(post_save, sender=Student)
def student_saved_handler(sender, instance, created, **kwargs):
    if created:
        pass
