import uuid
from django.db import models
from apps.common.models import TimeStampedModel

class FeeCategory(models.TextChoices):
    TUITION = 'Tuition', 'Tuition'
    TRANSPORT = 'Transport', 'Transport'
    LABORATORY = 'Laboratory', 'Laboratory'
    SPORTS = 'Sports', 'Sports'
    ANNUAL = 'Annual', 'Annual'

class PaymentMode(models.TextChoices):
    ONLINE = 'Online', 'Online'
    CASH = 'Cash', 'Cash'
    CHEQUE = 'Cheque', 'Cheque'
    UPI = 'UPI', 'UPI'

class FeeRecord(TimeStampedModel):
    """Student tuition and fee records."""
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='fee_records'
    )
    receipt_number = models.CharField(max_length=50, unique=True, db_index=True)
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='fee_records')
    category = models.CharField(max_length=50, choices=FeeCategory.choices, default=FeeCategory.TUITION)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    paid_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=30, default='Pending')
    payment_mode = models.CharField(max_length=30, choices=PaymentMode.choices, null=True, blank=True)
    qr_code = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        ordering = ['-due_date']

    def __str__(self):
        return f"{self.receipt_number} - {self.student.name} ({self.category}): {self.status}"
