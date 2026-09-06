from typing import Tuple, Dict, Any
from django.db import transaction
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, UserRole
from apps.organizations.models import Organization

def create_organization_admin(
    org: Organization,
    email: str,
    password: str,
    first_name: str = "",
    last_name: str = "",
    mobile: str = None
) -> Tuple[User, RefreshToken]:
    """
    Domain service for creating an Organization Admin and issuing SimpleJWT tokens.
    """
    with transaction.atomic():
        user = User.objects.create(
            organization=org,
            email=email.lower().strip(),
            first_name=first_name,
            last_name=last_name,
            mobile=mobile,
            role=UserRole.ORG_ADMIN,
            is_active=True,
            is_verified=True,
        )
        user.set_password(password)
        user.save()

        refresh = RefreshToken.for_user(user)
        return user, refresh

def blacklist_token(refresh_token_str: str) -> bool:
    """
    Domain service for blacklisting refresh tokens on logout.
    """
    try:
        token = RefreshToken(refresh_token_str)
        token.blacklist()
        return True
    except Exception:
        return False
