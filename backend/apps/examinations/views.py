from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from .serializers import ExaminationSerializer, ExamResultSerializer
from .selectors import get_examinations, get_exam_results
from .services import create_examination

class ExaminationListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ExaminationSerializer

    @extend_schema(summary="List Examinations", responses={200: ExaminationSerializer(many=True)})
    def get(self, request):
        if not request.user.organization_id:
            return Response([], status=status.HTTP_200_OK)
        exams = get_examinations(str(request.user.organization_id), grade=request.query_params.get('grade'))
        return Response(ExaminationSerializer(exams, many=True).data, status=status.HTTP_200_OK)

    @extend_schema(summary="Schedule Examination", request=ExaminationSerializer, responses={201: ExaminationSerializer})
    def post(self, request):
        serializer = ExaminationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        exam = create_examination(request.user.organization, serializer.validated_data)
        return Response(ExaminationSerializer(exam).data, status=status.HTTP_201_CREATED)

class ExaminationResultsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(summary="Get Examination Results", responses={200: ExamResultSerializer(many=True)})
    def get(self, request):
        exam_id = request.query_params.get('exam_id')
        if not exam_id:
            return Response({"detail": "exam_id query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        results = get_exam_results(exam_id)
        return Response(ExamResultSerializer(results, many=True).data, status=status.HTTP_200_OK)
