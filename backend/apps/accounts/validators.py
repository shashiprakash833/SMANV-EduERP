import re
from rest_framework.exceptions import ValidationError

def validate_password_strength(password: str) -> None:
    """Ensures password meets minimum security standards."""
    if len(password) < 6:
        raise ValidationError("Password must be at least 6 characters.")

def validate_email_domain(email: str) -> None:
    """Basic structural validation for email address."""
    pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if not re.match(pattern, email):
        raise ValidationError("Invalid email address format.")
