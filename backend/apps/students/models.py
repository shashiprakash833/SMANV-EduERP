import uuid
from django.db import models
from apps.common.models import TimeStampedModel

class Gender(models.TextChoices):
    MALE = 'Male', 'Male'
    FEMALE = 'Female', 'Female'
    OTHER = 'Other', 'Other'

class FeeStatus(models.TextChoices):
    PAID = 'Paid', 'Paid'
    PARTIAL = 'Partial', 'Partial'
    PENDING = 'Pending', 'Pending'
    OVERDUE = 'Overdue', 'Overdue'

class AdmissionStage(models.TextChoices):
    APPLIED = 'Applied', 'Applied'
    SCREENING = 'Screening', 'Screening'
    INTERVIEW = 'Interview', 'Interview'
    OFFERED = 'Offered', 'Offered'
    ENROLLED = 'Enrolled', 'Enrolled'
    REJECTED = 'Rejected', 'Rejected'

class Student(TimeStampedModel):
    """Student profile linked to organization and user account."""
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='students'
    )
    user = models.OneToOneField(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='student_profile'
    )
    name = models.CharField(max_length=255)
    roll_number = models.CharField(max_length=50, db_index=True)
    grade = models.CharField(max_length=50)
    section = models.CharField(max_length=50)
    gender = models.CharField(max_length=20, choices=Gender.choices, default=Gender.OTHER)
    dob = models.DateField(null=True, blank=True)
    blood_group = models.CharField(max_length=10, blank=True, null=True)
    parent_name = models.CharField(max_length=255)
    parent_phone = models.CharField(max_length=25)
    parent_email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    attendance_rate = models.FloatField(default=100.0)
    fee_status = models.CharField(max_length=20, choices=FeeStatus.choices, default=FeeStatus.PENDING)
    pending_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    avatar = models.ImageField(upload_to='student_avatars/', blank=True, null=True)
    qr_code = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        verbose_name = "Student"
        verbose_name_plural = "Students"
        unique_together = ('organization', 'roll_number')
        ordering = ['grade', 'section', 'roll_number']

    def __str__(self):
        return f"{self.name} ({self.grade}-{self.section}, Roll: {self.roll_number})"

class AdmissionApplication(TimeStampedModel):
    """New prospective student admissions application."""
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='admission_applications'
    )
    applicant_name = models.CharField(max_length=255)
    grade_applying = models.CharField(max_length=50)
    parent_name = models.CharField(max_length=255)
    parent_phone = models.CharField(max_length=25)
    applied_date = models.DateField(auto_now_add=True)
    stage = models.CharField(max_length=30, choices=AdmissionStage.choices, default=AdmissionStage.APPLIED)
    previous_school = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-applied_date']

    def __str__(self):
        return f"{self.applicant_name} - {self.grade_applying} ({self.stage})"
