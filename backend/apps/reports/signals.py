from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import ReportMetric

@receiver(post_save, sender=ReportMetric)
def report_saved_handler(sender, instance, created, **kwargs):
    pass
