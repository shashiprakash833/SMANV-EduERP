from typing import Dict, Any
from .models import ClassSession, Assignment
from apps.organizations.models import Organization

def create_class_session(organization: Organization, data: Dict[str, Any]) -> ClassSession:
    return ClassSession.objects.create(organization=organization, **data)

def create_assignment(organization: Organization, data: Dict[str, Any]) -> Assignment:
    return Assignment.objects.create(organization=organization, **data)
