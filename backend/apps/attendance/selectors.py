from typing import Dict, Any
from django.db.models import QuerySet, Count
from .models import AttendanceRecord

def get_attendance_history(organization_id: str, date: str = None, grade: str = None, section: str = None) -> QuerySet[AttendanceRecord]:
    qs = AttendanceRecord.objects.filter(organization_id=organization_id)
    if date:
        qs = qs.filter(date=date)
    if grade:
        qs = qs.filter(grade=grade)
    if section:
        qs = qs.filter(section=section)
    return qs

def get_attendance_summary(organization_id: str, date: str) -> Dict[str, Any]:
    qs = AttendanceRecord.objects.filter(organization_id=organization_id, date=date)
    total = qs.count()
    present = qs.filter(status='Present').count()
    absent = qs.filter(status='Absent').count()
    late = qs.filter(status='Late').count()
    rate = (present / total * 100) if total > 0 else 0
    return {
        "date": date,
        "total": total,
        "present": present,
        "absent": absent,
        "late": late,
        "rate": round(rate, 1)
    }
