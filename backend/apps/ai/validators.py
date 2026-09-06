from rest_framework.exceptions import ValidationError

def validate_chat_prompt(prompt: str) -> None:
    if not prompt or not prompt.strip():
        raise ValidationError("Prompt cannot be empty.")
