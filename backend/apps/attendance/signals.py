from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import AttendanceRecord

@receiver(post_save, sender=AttendanceRecord)
def attendance_saved_handler(sender, instance, created, **kwargs):
    pass
