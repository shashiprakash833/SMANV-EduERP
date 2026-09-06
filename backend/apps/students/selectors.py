from typing import Optional
from django.db.models import QuerySet
from .models import Student, AdmissionApplication

def get_student_by_id(student_id: str) -> Optional[Student]:
    """Retrieve student by UUID."""
    try:
        return Student.objects.select_related('organization', 'user').get(id=student_id)
    except Student.DoesNotExist:
        return None

def get_students_for_org(organization_id: str, grade: str = None, section: str = None) -> QuerySet[Student]:
    """Query students by tenant organization with optional grade/section filtering."""
    qs = Student.objects.filter(organization_id=organization_id)
    if grade:
        qs = qs.filter(grade=grade)
    if section:
        qs = qs.filter(section=section)
    return qs

def get_admission_applications_for_org(organization_id: str) -> QuerySet[AdmissionApplication]:
    """Query admission applications for organization."""
    return AdmissionApplication.objects.filter(organization_id=organization_id)
