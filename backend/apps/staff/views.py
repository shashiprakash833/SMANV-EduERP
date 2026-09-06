from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from .serializers import StaffSerializer
from .selectors import get_staff_for_org, get_staff_by_id
from .services import create_staff, update_staff

class StaffListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StaffSerializer

    @extend_schema(summary="List Staff", responses={200: StaffSerializer(many=True)})
    def get(self, request):
        if not request.user.organization_id:
            return Response([], status=status.HTTP_200_OK)
        staff_list = get_staff_for_org(
            str(request.user.organization_id),
            department=request.query_params.get('department')
        )
        return Response(StaffSerializer(staff_list, many=True).data, status=status.HTTP_200_OK)

    @extend_schema(summary="Add Staff", request=StaffSerializer, responses={201: StaffSerializer})
    def post(self, request):
        serializer = StaffSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        staff = create_staff(request.user.organization, serializer.validated_data)
        return Response(StaffSerializer(staff).data, status=status.HTTP_201_CREATED)

class StaffDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StaffSerializer

    def get(self, request, pk):
        staff = get_staff_by_id(pk)
        if not staff or (request.user.organization_id and staff.organization_id != request.user.organization_id):
            return Response({"detail": "Staff member not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(StaffSerializer(staff).data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        staff = get_staff_by_id(pk)
        if not staff or (request.user.organization_id and staff.organization_id != request.user.organization_id):
            return Response({"detail": "Staff member not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = StaffSerializer(staff, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = update_staff(staff, serializer.validated_data)
        return Response(StaffSerializer(updated).data, status=status.HTTP_200_OK)
