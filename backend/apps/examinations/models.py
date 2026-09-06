import uuid
from django.db import models
from apps.common.models import TimeStampedModel

class ExamStatus(models.TextChoices):
    SCHEDULED = 'Scheduled', 'Scheduled'
    IN_PROGRESS = 'In Progress', 'In Progress'
    COMPLETED = 'Completed', 'Completed'

class Examination(TimeStampedModel):
    """Exam schedule and grading parameters."""
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='examinations'
    )
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=100)
    grade = models.CharField(max_length=50)
    date = models.DateField()
    start_time = models.CharField(max_length=20)
    end_time = models.CharField(max_length=20)
    room = models.CharField(max_length=50)
    max_marks = models.PositiveIntegerField(default=100)
    pass_percentage = models.PositiveIntegerField(default=40)
    status = models.CharField(max_length=30, choices=ExamStatus.choices, default=ExamStatus.SCHEDULED)

    class Meta:
        ordering = ['date', 'start_time']

    def __str__(self):
        return f"{self.title} - {self.subject} ({self.grade})"

class ExamResult(TimeStampedModel):
    """Individual student exam score."""
    examination = models.ForeignKey(Examination, on_delete=models.CASCADE, related_name='results')
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='exam_results')
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2)
    grade_letter = models.CharField(max_length=5, blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('examination', 'student')
