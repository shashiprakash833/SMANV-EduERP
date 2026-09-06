import uuid
from django.db import models
from apps.common.models import TimeStampedModel

class InsightType(models.TextChoices):
    ATTENDANCE = 'attendance', 'Attendance'
    FEE = 'fee', 'Fee'
    PERFORMANCE = 'performance', 'Performance'
    WORKLOAD = 'workload', 'Workload'

class InsightSeverity(models.TextChoices):
    INFO = 'info', 'Info'
    WARNING = 'warning', 'Warning'
    CRITICAL = 'critical', 'Critical'
    SUCCESS = 'success', 'Success'

class AIInsight(TimeStampedModel):
    """Automated operational and pedagogical insights."""
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='ai_insights'
    )
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=30, choices=InsightType.choices, default=InsightType.ATTENDANCE)
    severity = models.CharField(max_length=20, choices=InsightSeverity.choices, default=InsightSeverity.INFO)
    description = models.TextField()
    recommendation = models.TextField()
    metric = models.CharField(max_length=100, blank=True, null=True)
    action_text = models.CharField(max_length=100, blank=True, null=True)
    action_route = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.severity}] {self.title}"
