from rest_framework.exceptions import ValidationError

def validate_notification_message(message: str) -> None:
    if not message or not message.strip():
        raise ValidationError("Notification message cannot be empty.")
