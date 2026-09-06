import uuid
from django.db import models
from apps.common.models import TimeStampedModel

class MetricCategory(models.TextChoices):
    ACADEMIC = 'academic', 'Academic'
    ATTENDANCE = 'attendance', 'Attendance'
    FINANCIAL = 'financial', 'Financial'
    ADMISSIONS = 'admissions', 'Admissions'

class TrendDirection(models.TextChoices):
    UP = 'up', 'Up'
    DOWN = 'down', 'Down'
    NEUTRAL = 'neutral', 'Neutral'

class ReportMetric(TimeStampedModel):
    """Aggregated KPI metrics for executive dashboards."""
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='report_metrics'
    )
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=30, choices=MetricCategory.choices, default=MetricCategory.ACADEMIC)
    value = models.CharField(max_length=50)
    change = models.CharField(max_length=50, default='+0.0%')
    trend = models.CharField(max_length=20, choices=TrendDirection.choices, default=TrendDirection.NEUTRAL)
    period = models.CharField(max_length=100, default='This Month')

    class Meta:
        ordering = ['category', 'title']

    def __str__(self):
        return f"{self.title}: {self.value} ({self.change})"
