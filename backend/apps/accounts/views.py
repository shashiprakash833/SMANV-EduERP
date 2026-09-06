from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .serializers import (
    UserSerializer,
    LoginSerializer,
    RegisterOrganizationSerializer,
    LogoutSerializer,
)
from apps.organizations.serializers import OrganizationSerializer

class RegisterView(APIView):
    """
    Registers a School or College organization along with its primary Administrator.
    Returns JWT authentication tokens and initial profile state.
    Available at:
    - POST /api/v1/auth/register/
    - POST /api/v1/organizations/register/
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterOrganizationSerializer

    @extend_schema(
        summary="Register Educational Institution",
        description="Creates Organization record, Org Admin user account, and issues SimpleJWT tokens.",
        request=RegisterOrganizationSerializer,
        responses={
            201: OpenApiResponse(description="Organization and Admin successfully created with JWT tokens."),
            400: OpenApiResponse(description="Validation error in payload.")
        }
    )
    def post(self, request):
        serializer = RegisterOrganizationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = serializer.save()

        user = result['user']
        org = result['organization']
        access = result['access']
        refresh = result['refresh']

        user_data = UserSerializer(user, context={'request': request}).data
        org_data = OrganizationSerializer(org, context={'request': request}).data

        response_payload = {
            "access": access,
            "refresh": refresh,
            "tokens": {
                "access": access,
                "refresh": refresh,
            },
            "user": user_data,
            "organization": org_data,
            "message": "Organization registered successfully"
        }
        return Response(response_payload, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    """
    Authenticates user with email/username and password.
    Validates tenant organization status and issues SimpleJWT access and refresh tokens.
    Available at:
    - POST /api/v1/auth/login/
    - POST /api/v1/auth/token/
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    @extend_schema(
        summary="User Authentication (Login)",
        description="Validates user credentials, checks active status, and returns JWT tokens with profile.",
        request=LoginSerializer,
        responses={
            200: OpenApiResponse(description="Login successful with tokens and profile."),
            400: OpenApiResponse(description="Invalid credentials or inactive account.")
        }
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        org = serializer.validated_data['organization']
        access = serializer.validated_data['access']
        refresh = serializer.validated_data['refresh']

        user_data = UserSerializer(user, context={'request': request}).data
        org_data = OrganizationSerializer(org, context={'request': request}).data if org else None

        response_payload = {
            "access": access,
            "refresh": refresh,
            "tokens": {
                "access": access,
                "refresh": refresh,
            },
            "user": user_data,
            "organization": org_data,
            "message": "Login successful"
        }
        return Response(response_payload, status=status.HTTP_200_OK)

class LogoutView(APIView):
    """
    Terminates the user session by blacklisting the provided refresh token.
    Available at:
    - POST /api/v1/auth/logout/
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = LogoutSerializer

    @extend_schema(
        summary="User Logout",
        description="Blacklists the provided refresh token.",
        request=LogoutSerializer,
        responses={
            200: OpenApiResponse(description="Logged out successfully.")
        }
    )
    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Logged out successfully.", "message": "Logged out successfully."},
            status=status.HTTP_200_OK
        )

class CurrentUserView(APIView):
    """
    Retrieves currently authenticated user profile and organization details.
    Available at:
    - GET /api/v1/auth/me/
    - GET /api/v1/auth/user/
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    @extend_schema(
        summary="Get Current User Profile",
        description="Returns profile of the user identified by the Bearer JWT token.",
        responses={200: UserSerializer}
    )
    def get(self, request):
        user = request.user
        user_data = UserSerializer(user, context={'request': request}).data
        org_data = (
            OrganizationSerializer(user.organization, context={'request': request}).data
            if user.organization else None
        )

        response_payload = {
            **user_data,
            "user": user_data,
            "organization": org_data,
        }
        return Response(response_payload, status=status.HTTP_200_OK)

class CustomTokenRefreshView(TokenRefreshView):
    """
    Rotates SimpleJWT tokens.
    Available at:
    - POST /api/v1/auth/refresh/
    - POST /api/v1/auth/token/refresh/
    """
    @extend_schema(
        summary="Refresh JWT Access Token",
        description="Takes a valid refresh token and returns a new access token (and rotated refresh token)."
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
