from rest_framework.exceptions import ValidationError

def validate_roll_number(roll: str) -> None:
    if not roll or not roll.strip():
        raise ValidationError("Roll number cannot be blank.")
