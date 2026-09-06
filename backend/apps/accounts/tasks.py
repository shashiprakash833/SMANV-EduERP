"""Accounts background tasks (ready for Celery / Django Q)."""

def send_welcome_email_task(user_id: str):
    """Background task placeholder to send welcome onboarding email."""
    pass

def send_password_reset_email_task(user_id: str, reset_token: str):
    """Background task placeholder to send password reset instructions."""
    pass
