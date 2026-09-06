from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .serializers import AttendanceRecordSerializer, BatchAttendanceSerializer
from .selectors import get_attendance_history, get_attendance_summary
from .services import mark_batch_attendance

class AttendanceSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Get Daily Attendance Summary",
        responses={200: OpenApiResponse(description="Daily attendance counts and percentage rate")}
    )
    def get(self, request):
        if not request.user.organization_id:
            return Response({"rate": 0, "total": 0, "present": 0, "absent": 0, "late": 0})
        date_str = request.query_params.get('date', str(timezone.now().date()))
        summary = get_attendance_summary(str(request.user.organization_id), date_str)
        return Response(summary, status=status.HTTP_200_OK)

class AttendanceBatchMarkView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BatchAttendanceSerializer

    @extend_schema(summary="Mark Batch Attendance", request=BatchAttendanceSerializer)
    def post(self, request):
        serializer = BatchAttendanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        count = mark_batch_attendance(
            request.user.organization,
            str(serializer.validated_data['date']),
            serializer.validated_data['records']
        )
        return Response({"message": f"Successfully marked attendance for {count} records.", "count": count}, status=status.HTTP_200_OK)

class AttendanceHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AttendanceRecordSerializer

    @extend_schema(summary="Get Attendance History", responses={200: AttendanceRecordSerializer(many=True)})
    def get(self, request):
        if not request.user.organization_id:
            return Response([], status=status.HTTP_200_OK)
        records = get_attendance_history(
            str(request.user.organization_id),
            date=request.query_params.get('date'),
            grade=request.query_params.get('grade'),
            section=request.query_params.get('section')
        )
        return Response(AttendanceRecordSerializer(records, many=True).data, status=status.HTTP_200_OK)
