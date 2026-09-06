from typing import Dict, Any
from django.db import transaction
from .models import Student, AdmissionApplication
from apps.organizations.models import Organization

def create_student(organization: Organization, data: Dict[str, Any]) -> Student:
    """Domain service for enrolling a new student."""
    with transaction.atomic():
        return Student.objects.create(organization=organization, **data)

def update_student(student: Student, data: Dict[str, Any]) -> Student:
    """Domain service for updating student records."""
    for key, value in data.items():
        setattr(student, key, value)
    student.save()
    return student

def submit_admission_application(organization: Organization, data: Dict[str, Any]) -> AdmissionApplication:
    """Domain service for handling prospective student application."""
    return AdmissionApplication.objects.create(organization=organization, **data)
