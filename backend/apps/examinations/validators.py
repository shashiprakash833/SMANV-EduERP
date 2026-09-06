from rest_framework.exceptions import ValidationError

def validate_max_marks(marks: int) -> None:
    if marks <= 0:
        raise ValidationError("Maximum marks must be greater than zero.")
