from typing import Optional
from django.db.models import QuerySet
from .models import Organization, OrganizationStatus

def get_organization_by_id(org_id: str) -> Optional[Organization]:
    """Retrieve organization by primary UUID."""
    try:
        return Organization.objects.get(id=org_id)
    except Organization.DoesNotExist:
        return None

def get_active_organizations() -> QuerySet[Organization]:
    """List all organizations with ACTIVE status."""
    return Organization.objects.filter(status=OrganizationStatus.ACTIVE)
