from typing import List, Dict, Any
from django.db import transaction
from .models import AttendanceRecord
from apps.organizations.models import Organization

def mark_batch_attendance(organization: Organization, date: str, records: List[Dict[str, Any]]) -> int:
    """Batch marks attendance for an entire class or department."""
    count = 0
    with transaction.atomic():
        for r in records:
            AttendanceRecord.objects.update_or_create(
                organization=organization,
                entity_id=r['entity_id'],
                date=date,
                defaults={
                    'entity_name': r.get('entity_name', ''),
                    'entity_type': r.get('entity_type', 'student'),
                    'status': r.get('status', 'Present'),
                    'grade': r.get('grade'),
                    'section': r.get('section'),
                    'department': r.get('department'),
                    'remarks': r.get('remarks', '')
                }
            )
            count += 1
    return count
