from typing import Dict, Any
from django.db import transaction
from .models import Organization, OrganizationType, OrganizationStatus

def create_organization(data: Dict[str, Any]) -> Organization:
    """Creates a new educational institution organization."""
    return Organization.objects.create(**data)

def update_organization(org: Organization, data: Dict[str, Any]) -> Organization:
    """Updates organization profile information."""
    for attr, value in data.items():
        setattr(org, attr, value)
    org.save()
    return org
