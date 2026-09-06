import uuid
from django.db import models
from apps.common.models import TimeStampedModel

class AttendanceStatus(models.TextChoices):
    PRESENT = 'Present', 'Present'
    ABSENT = 'Absent', 'Absent'
    LATE = 'Late', 'Late'
    HALF_DAY = 'Half Day', 'Half Day'

class EntityType(models.TextChoices):
    STUDENT = 'student', 'Student'
    STAFF = 'staff', 'Staff'

class AttendanceRecord(TimeStampedModel):
    """Daily attendance records for students and staff."""
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )
    entity_id = models.UUIDField(db_index=True)
    entity_name = models.CharField(max_length=255)
    entity_type = models.CharField(max_length=20, choices=EntityType.choices, default=EntityType.STUDENT)
    date = models.DateField(db_index=True)
    status = models.CharField(max_length=20, choices=AttendanceStatus.choices, default=AttendanceStatus.PRESENT)
    grade = models.CharField(max_length=50, blank=True, null=True)
    section = models.CharField(max_length=50, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    time_in = models.TimeField(null=True, blank=True)
    remarks = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Attendance Record"
        verbose_name_plural = "Attendance Records"
        unique_together = ('organization', 'entity_id', 'date')
        ordering = ['-date', 'entity_name']

    def __str__(self):
        return f"{self.entity_name} ({self.date}): {self.status}"
