import uuid
from django.db import models
from apps.common.models import TimeStampedModel

class StaffStatus(models.TextChoices):
    IN_CLASS = 'In Class', 'In Class'
    ON_DUTY = 'On Duty', 'On Duty'
    ON_LEAVE = 'On Leave', 'On Leave'

class Staff(TimeStampedModel):
    """Faculty and administrative staff records."""
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='staff_members'
    )
    user = models.OneToOneField(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='staff_profile'
    )
    name = models.CharField(max_length=255)
    employee_code = models.CharField(max_length=50, db_index=True)
    department = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=25)
    qualification = models.CharField(max_length=255, blank=True, null=True)
    joining_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=30, choices=StaffStatus.choices, default=StaffStatus.ON_DUTY)
    attendance_rate = models.FloatField(default=100.0)
    subjects = models.JSONField(default=list, blank=True)
    avatar = models.ImageField(upload_to='staff_avatars/', blank=True, null=True)

    class Meta:
        verbose_name = "Staff Member"
        verbose_name_plural = "Staff Members"
        unique_together = ('organization', 'employee_code')
        ordering = ['department', 'name']

    def __str__(self):
        return f"{self.name} ({self.designation} - {self.department})"
