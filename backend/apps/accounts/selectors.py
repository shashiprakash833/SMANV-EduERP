from typing import Optional
from django.db.models import QuerySet
from .models import User

def get_user_by_id(user_id: str) -> Optional[User]:
    """Retrieve user by primary key UUID."""
    try:
        return User.objects.select_related('organization').get(id=user_id)
    except User.DoesNotExist:
        return None

def get_user_by_email(email: str) -> Optional[User]:
    """Retrieve user by normalized email."""
    try:
        return User.objects.select_related('organization').get(email=email.strip().lower())
    except User.DoesNotExist:
        return None

def get_users_for_organization(organization_id: str) -> QuerySet[User]:
    """Query active users for a specific tenant organization."""
    return User.objects.filter(organization_id=organization_id, is_active=True).order_by('first_name', 'last_name')
