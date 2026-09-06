from rest_framework import status, permissions, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .serializers import ReportMetricSerializer
from .selectors import get_report_metrics

class ExecutiveSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReportMetricSerializer

    @extend_schema(summary="Get Executive Analytics Summary", responses={200: ReportMetricSerializer(many=True)})
    def get(self, request):
        if not request.user.organization_id:
            return Response([], status=status.HTTP_200_OK)
        metrics = get_report_metrics(str(request.user.organization_id), category=request.query_params.get('category'))
        return Response(ReportMetricSerializer(metrics, many=True).data, status=status.HTTP_200_OK)

class ExportPdfView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.Serializer

    @extend_schema(summary="Export Report as PDF", responses={200: OpenApiResponse(description="PDF generation queued")})
    def post(self, request):
        return Response({"status": "queued", "message": "PDF export generation initiated."}, status=status.HTTP_200_OK)

class ExportExcelView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.Serializer

    @extend_schema(summary="Export Report as Excel", responses={200: OpenApiResponse(description="Excel generation queued")})
    def post(self, request):
        return Response({"status": "queued", "message": "Excel export generation initiated."}, status=status.HTTP_200_OK)
