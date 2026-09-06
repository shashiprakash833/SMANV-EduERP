from typing import Optional
from django.db.models import QuerySet
from .models import Examination, ExamResult

def get_examinations(organization_id: str, grade: str = None) -> QuerySet[Examination]:
    qs = Examination.objects.filter(organization_id=organization_id)
    if grade:
        qs = qs.filter(grade=grade)
    return qs

def get_exam_results(examination_id: str) -> QuerySet[ExamResult]:
    return ExamResult.objects.select_related('student', 'examination').filter(examination_id=examination_id)
