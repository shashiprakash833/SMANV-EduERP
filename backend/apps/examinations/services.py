from typing import Dict, Any
from .models import Examination, ExamResult
from apps.organizations.models import Organization

def create_examination(organization: Organization, data: Dict[str, Any]) -> Examination:
    return Examination.objects.create(organization=organization, **data)

def record_exam_result(examination: Examination, student, marks: float, grade_letter: str = None) -> ExamResult:
    return ExamResult.objects.update_or_create(
        examination=examination,
        student=student,
        defaults={'marks_obtained': marks, 'grade_letter': grade_letter}
    )[0]
