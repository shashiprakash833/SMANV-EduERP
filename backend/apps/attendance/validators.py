from rest_framework.exceptions import ValidationError

def validate_attendance_date(date_str: str) -> None:
    if not date_str:
        raise ValidationError("Attendance date is required.")
