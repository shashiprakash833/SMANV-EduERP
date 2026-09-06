from rest_framework.exceptions import ValidationError

def validate_positive_amount(amount: float) -> None:
    if amount <= 0:
        raise ValidationError("Amount must be greater than zero.")
