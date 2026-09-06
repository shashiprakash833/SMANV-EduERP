from rest_framework.exceptions import ValidationError

def validate_period_number(period: int) -> None:
    if period < 1 or period > 12:
        raise ValidationError("Period must be between 1 and 12.")
