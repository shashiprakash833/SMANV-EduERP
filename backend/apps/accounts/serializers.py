from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth import authenticate
from django.db import transaction
from .models import User, UserRole
from apps.organizations.models import Organization, OrganizationType, OrganizationStatus
from apps.organizations.serializers import OrganizationSerializer

class UserSerializer(serializers.ModelSerializer):
    """
    Standard serialized representation of User.
    Guarantees field compatibility with SMANV EduERP frontend's normalizeUser function.
    """
    name = serializers.CharField(read_only=True)
    phone = serializers.CharField(source='mobile', read_only=True)
    avatar_url = serializers.CharField(read_only=True)
    organization_id = serializers.UUIDField(source='organization.id', read_only=True, allow_null=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True, allow_null=True)
    organization = OrganizationSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'name',
            'first_name',
            'last_name',
            'mobile',
            'phone',
            'role',
            'organization_id',
            'organization_name',
            'organization',
            'avatar_url',
            'designation',
            'department',
            'student_id',
            'grade',
            'section',
            'is_active',
            'is_verified',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_verified']

class LoginSerializer(serializers.Serializer):
    """
    Handles user login. Supports email, username, and password.
    Enforces organization status validation and issues JWT tokens.
    """
    email = serializers.CharField(required=False)
    username = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        raw_email = (attrs.get('email') or attrs.get('username') or '').strip().lower()
        password = attrs.get('password')

        if not raw_email or not password:
            raise serializers.ValidationError({"detail": "Both email and password are required."})

        # Look up user by email
        try:
            user = User.objects.select_related('organization').get(email=raw_email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"detail": "Invalid credentials. Please verify your email and password."})

        if not user.check_password(password):
            raise serializers.ValidationError({"detail": "Invalid credentials. Please verify your email and password."})

        if not user.is_active:
            raise serializers.ValidationError({"detail": "This account is currently deactivated. Please contact support."})

        # Check tenant organization status if assigned
        if user.organization and not user.is_superuser:
            if user.organization.status != OrganizationStatus.ACTIVE:
                raise serializers.ValidationError({
                    "detail": f"Organization account is currently {user.organization.get_status_display().lower()}. Please contact administrator."
                })

        # Optional preferred role check
        preferred_role = attrs.get('role')
        if preferred_role and user.role != preferred_role and not user.is_superuser:
            # Note: We still permit login, but can log or align if needed
            pass

        # Generate SimpleJWT tokens
        refresh = RefreshToken.for_user(user)

        # Store validated objects in attrs
        attrs['user'] = user
        attrs['organization'] = user.organization
        attrs['access'] = str(refresh.access_token)
        attrs['refresh'] = str(refresh)

        return attrs

class RegisterOrganizationSerializer(serializers.Serializer):
    """
    Handles School / College Organization Registration and Admin Account Creation.
    Supports both nested payloads and flat key/value payloads sent by frontend.
    """
    # Nested fields
    organization = serializers.DictField(required=False)
    admin = serializers.DictField(required=False)

    # Flat aliases
    org_name = serializers.CharField(required=False, allow_blank=True)
    org_type = serializers.CharField(required=False, allow_blank=True)
    org_email = serializers.CharField(required=False, allow_blank=True)
    org_phone = serializers.CharField(required=False, allow_blank=True)
    org_address = serializers.CharField(required=False, allow_blank=True)
    org_city = serializers.CharField(required=False, allow_blank=True)
    org_state = serializers.CharField(required=False, allow_blank=True)
    org_pincode = serializers.CharField(required=False, allow_blank=True)
    admin_name = serializers.CharField(required=False, allow_blank=True)
    admin_email = serializers.CharField(required=False, allow_blank=True)
    admin_phone = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(required=False, allow_blank=True, write_only=True)

    def validate(self, attrs):
        org_data = attrs.get('organization') or {}
        admin_data = attrs.get('admin') or {}

        # Extract normalized fields
        name = (org_data.get('name') or attrs.get('org_name') or '').strip()
        org_type = (org_data.get('type') or attrs.get('org_type') or 'school').lower()
        org_email = (org_data.get('email') or attrs.get('org_email') or '').strip()
        org_phone = (org_data.get('phone') or attrs.get('org_phone') or '').strip()
        org_address = (org_data.get('address') or attrs.get('org_address') or '').strip()
        org_city = (org_data.get('city') or attrs.get('org_city') or '').strip()
        org_state = (org_data.get('state') or attrs.get('org_state') or '').strip()
        org_pincode = (org_data.get('pincode') or attrs.get('org_pincode') or '').strip()

        admin_full_name = (admin_data.get('name') or attrs.get('admin_name') or '').strip()
        admin_email_addr = (admin_data.get('email') or attrs.get('admin_email') or '').strip().lower()
        admin_phone_num = (admin_data.get('phone') or attrs.get('admin_phone') or '').strip()
        admin_pass = admin_data.get('password') or attrs.get('password') or ''

        if not name:
            raise serializers.ValidationError({"organization": {"name": ["Organization name is required."]}})
        if not admin_email_addr:
            raise serializers.ValidationError({"admin": {"email": ["Admin email is required."]}})
        if not admin_pass or len(admin_pass) < 6:
            raise serializers.ValidationError({"admin": {"password": ["Password must be at least 6 characters."]}})

        # Check duplicate email
        if User.objects.filter(email=admin_email_addr).exists():
            raise serializers.ValidationError({"admin": {"email": ["An account with this email address already exists."]}})

        # Split full name into first and last name
        name_parts = admin_full_name.split(' ', 1)
        first_name = name_parts[0] if name_parts else 'Admin'
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        attrs['extracted'] = {
            'org': {
                'name': name,
                'type': org_type if org_type in OrganizationType.values else OrganizationType.SCHOOL,
                'email': org_email or None,
                'phone': org_phone or None,
                'address': org_address or None,
                'city': org_city or None,
                'state': org_state or None,
                'pincode': org_pincode or None,
                'status': OrganizationStatus.ACTIVE,
            },
            'admin': {
                'first_name': first_name,
                'last_name': last_name,
                'email': admin_email_addr,
                'mobile': admin_phone_num or None,
                'password': admin_pass,
                'role': UserRole.ORG_ADMIN,
                'is_active': True,
                'is_verified': True,
            }
        }
        return attrs

    def create(self, validated_data):
        extracted = validated_data['extracted']
        with transaction.atomic():
            # 1. Create Organization
            org = Organization.objects.create(**extracted['org'])

            # 2. Create Organization Admin User
            admin_info = extracted['admin']
            password = admin_info.pop('password')
            user = User.objects.create(
                organization=org,
                **admin_info
            )
            user.set_password(password)
            user.save()

            # 3. Generate SimpleJWT Tokens
            refresh = RefreshToken.for_user(user)

            return {
                'organization': org,
                'user': user,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }

class LogoutSerializer(serializers.Serializer):
    """Blacklists refresh token for secure session termination."""
    refresh = serializers.CharField(required=False)
    refresh_token = serializers.CharField(required=False)

    def validate(self, attrs):
        token = attrs.get('refresh') or attrs.get('refresh_token')
        if not token:
            raise serializers.ValidationError({"detail": "Refresh token is required."})
        attrs['token'] = token
        return attrs

    def save(self, **kwargs):
        token_str = self.validated_data['token']
        try:
            token = RefreshToken(token_str)
            token.blacklist()
        except TokenError as e:
            # Token already invalid or blacklisted, safe to ignore
            pass
