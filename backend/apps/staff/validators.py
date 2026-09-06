from rest_framework.exceptions import ValidationError

def validate_employee_code(code: str) -> None:
    if not code or not code.strip():
        raise ValidationError("Employee code is required.")
