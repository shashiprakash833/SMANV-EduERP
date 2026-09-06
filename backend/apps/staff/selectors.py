from typing import Optional
from django.db.models import QuerySet
from .models import Staff

def get_staff_by_id(staff_id: str) -> Optional[Staff]:
    try:
        return Staff.objects.select_related('organization', 'user').get(id=staff_id)
    except Staff.DoesNotExist:
        return None

def get_staff_for_org(organization_id: str, department: str = None) -> QuerySet[Staff]:
    qs = Staff.objects.filter(organization_id=organization_id)
    if department:
        qs = qs.filter(department=department)
    return qs
