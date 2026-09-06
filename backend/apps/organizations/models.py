import uuid
from django.db import models
from apps.common.models import TimeStampedModel

class OrganizationType(models.TextChoices):
    SCHOOL = 'school', 'School'
    COLLEGE = 'college', 'College'
    UNIVERSITY = 'university', 'University'
    INSTITUTE = 'institute', 'Institute'

class SubscriptionPlan(models.TextChoices):
    TRIAL = 'trial', 'Trial'
    BASIC = 'basic', 'Basic'
    PRO = 'pro', 'Pro'
    ENTERPRISE = 'enterprise', 'Enterprise'

class OrganizationStatus(models.TextChoices):
    ACTIVE = 'active', 'Active'
    INACTIVE = 'inactive', 'Inactive'
    SUSPENDED = 'suspended', 'Suspended'
    PENDING = 'pending', 'Pending'

class Organization(TimeStampedModel):
    """
    Organization Model for Schools, Colleges, and Educational Institutions.
    Multi-tenant SaaS root entity.
    """
    name = models.CharField(max_length=255, help_text="Official name of the institution")
    type = models.CharField(
        max_length=50,
        choices=OrganizationType.choices,
        default=OrganizationType.SCHOOL,
        help_text="Type of institution (school/college/university/institute)"
    )
    code = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Short institutional code (e.g. SMANV)"
    )
    email = models.EmailField(blank=True, null=True, help_text="Official contact email")
    phone = models.CharField(max_length=25, blank=True, null=True, help_text="Primary phone number")
    address = models.TextField(blank=True, null=True, help_text="Campus street address")
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=20, blank=True, null=True)
    logo = models.ImageField(upload_to='org_logos/', blank=True, null=True)
    subscription_plan = models.CharField(
        max_length=50,
        choices=SubscriptionPlan.choices,
        default=SubscriptionPlan.TRIAL
    )
    status = models.CharField(
        max_length=50,
        choices=OrganizationStatus.choices,
        default=OrganizationStatus.ACTIVE,
        db_index=True
    )
    student_count = models.PositiveIntegerField(default=0)
    staff_count = models.PositiveIntegerField(default=0)
    established_year = models.PositiveIntegerField(default=2026)
    academic_year = models.CharField(max_length=25, default='2026-2027')

    class Meta:
        verbose_name = "Organization"
        verbose_name_plural = "Organizations"
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"

    @property
    def logo_url(self) -> str | None:
        if self.logo and hasattr(self.logo, 'url'):
            return self.logo.url
        return None
