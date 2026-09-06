from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .models import Organization
from .serializers import OrganizationSerializer, OrganizationUpdateSerializer
from apps.common.permissions import IsOrganizationAdmin

class CurrentOrganizationView(APIView):
    """
    Retrieve or update the organization profile for the currently authenticated user.
    Accessible at:
    - GET /api/v1/organizations/me/
    - PATCH /api/v1/organizations/me/
    - GET /api/v1/organizations/current/
    - PATCH /api/v1/organizations/current/
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrganizationSerializer

    @extend_schema(
        summary="Get Current Organization",
        description="Returns the organization associated with the logged-in user.",
        responses={200: OrganizationSerializer}
    )
    def get(self, request):
        user = request.user
        if not user.organization:
            return Response(
                {"detail": "User is not associated with an organization."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = OrganizationSerializer(user.organization, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Update Current Organization",
        description="Updates organization details. Requires Organization Admin or Super Admin role.",
        request=OrganizationUpdateSerializer,
        responses={200: OrganizationSerializer}
    )
    def patch(self, request):
        user = request.user
        if not user.organization:
            return Response(
                {"detail": "User is not associated with an organization."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Ensure user has org_admin or super_admin permissions
        if user.role not in ['org_admin', 'super_admin'] and not user.is_superuser:
            return Response(
                {"detail": "Permission denied. Only Organization Admins can update organization settings."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = OrganizationUpdateSerializer(
            user.organization,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        updated_org = serializer.save()

        full_serializer = OrganizationSerializer(updated_org, context={'request': request})
        return Response(full_serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        return self.patch(request)
