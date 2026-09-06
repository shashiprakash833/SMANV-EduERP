from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from drf_spectacular.utils import extend_schema

@extend_schema(
    summary="API Health & Diagnostics Check",
    description="Returns backend server health status and database connectivity.",
    responses={200: dict}
)
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint to test backend server and database availability."""
    db_status = "ok"
    try:
        connection.ensure_connection()
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return Response({
        "status": "online",
        "service": "SMANV EduERP Backend API",
        "version": "1.0.0",
        "company": "SMANV Info Tech Private Limited",
        "database": db_status,
    }, status=status.HTTP_200_OK if db_status == "ok" else status.HTTP_503_SERVICE_UNAVAILABLE)
