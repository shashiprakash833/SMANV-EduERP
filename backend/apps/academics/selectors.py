from typing import Optional
from django.db.models import QuerySet
from .models import ClassSession, Assignment

def get_timetable(organization_id: str, grade: str = None, section: str = None) -> QuerySet[ClassSession]:
    qs = ClassSession.objects.filter(organization_id=organization_id)
    if grade:
        qs = qs.filter(grade=grade)
    if section:
        qs = qs.filter(section=section)
    return qs

def get_assignments(organization_id: str, grade: str = None) -> QuerySet[Assignment]:
    qs = Assignment.objects.filter(organization_id=organization_id)
    if grade:
        qs = qs.filter(grade=grade)
    return qs
