from typing import Optional
from django.db.models import QuerySet
from .models import FeeRecord

def get_fee_records(organization_id: str, status: str = None) -> QuerySet[FeeRecord]:
    qs = FeeRecord.objects.select_related('student').filter(organization_id=organization_id)
    if status:
        qs = qs.filter(status=status)
    return qs

def get_fee_defaulters(organization_id: str) -> QuerySet[FeeRecord]:
    return FeeRecord.objects.select_related('student').filter(
        organization_id=organization_id,
        status__in=['Pending', 'Overdue']
    )
