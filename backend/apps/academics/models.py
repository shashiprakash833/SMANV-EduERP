import uuid
from django.db import models
from apps.common.models import TimeStampedModel

class SessionStatus(models.TextChoices):
    UPCOMING = 'Upcoming', 'Upcoming'
    ONGOING = 'Ongoing', 'Ongoing'
    COMPLETED = 'Completed', 'Completed'

class AssignmentStatus(models.TextChoices):
    ACTIVE = 'Active', 'Active'
    UNDER_REVIEW = 'Under Review', 'Under Review'
    GRADED = 'Graded', 'Graded'

class ClassSession(TimeStampedModel):
    """Timetable class session."""
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='class_sessions'
    )
    period = models.PositiveSmallIntegerField(default=1)
    start_time = models.CharField(max_length=20)
    end_time = models.CharField(max_length=20)
    subject = models.CharField(max_length=100)
    grade = models.CharField(max_length=50)
    section = models.CharField(max_length=50)
    room = models.CharField(max_length=50)
    teacher_name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=SessionStatus.choices, default=SessionStatus.UPCOMING)

    class Meta:
        ordering = ['period']

    def __str__(self):
        return f"Period {self.period}: {self.subject} ({self.grade}-{self.section})"

class Assignment(TimeStampedModel):
    """Class homework and assignments."""
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='assignments'
    )
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=100)
    grade = models.CharField(max_length=50)
    section = models.CharField(max_length=50)
    due_date = models.DateField()
    assigned_date = models.DateField(auto_now_add=True)
    total_marks = models.PositiveIntegerField(default=100)
    submissions_count = models.PositiveIntegerField(default=0)
    total_students = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=30, choices=AssignmentStatus.choices, default=AssignmentStatus.ACTIVE)
    description = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-due_date']

    def __str__(self):
        return f"{self.title} ({self.subject} - {self.grade})"
