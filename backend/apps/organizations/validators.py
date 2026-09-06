from rest_framework.exceptions import ValidationError

def validate_pincode(pincode: str) -> None:
    """Validates standard Indian 6-digit postal pincode."""
    if pincode and not (pincode.isdigit() and len(pincode) == 6):
        raise ValidationError("Pincode must be a 6-digit numerical code.")
