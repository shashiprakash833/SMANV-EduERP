from typing import Dict, Any
from .models import Staff
from apps.organizations.models import Organization

def create_staff(organization: Organization, data: Dict[str, Any]) -> Staff:
    return Staff.objects.create(organization=organization, **data)

def update_staff(staff: Staff, data: Dict[str, Any]) -> Staff:
    for key, value in data.items():
        setattr(staff, key, value)
    staff.save()
    return staff
