from typing import Dict, Any
from django.utils import timezone
from .models import FeeRecord
from apps.organizations.models import Organization

def collect_fee_payment(fee_record: FeeRecord, payment_mode: str) -> FeeRecord:
    fee_record.status = 'Paid'
    fee_record.paid_date = timezone.now().date()
    fee_record.payment_mode = payment_mode
    fee_record.save()
    return fee_record

def create_fee_record(organization: Organization, data: Dict[str, Any]) -> FeeRecord:
    return FeeRecord.objects.create(organization=organization, **data)
