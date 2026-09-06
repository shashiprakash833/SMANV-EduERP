from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from .serializers import StudentSerializer, AdmissionApplicationSerializer
from .selectors import get_students_for_org, get_student_by_id, get_admission_applications_for_org
from .services import create_student, update_student, submit_admission_application

class StudentListCreateView(APIView):
    """
    List and create students for the authenticated user's organization.
    Clean Architecture: delegates reads to selectors, writes to services.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StudentSerializer

    @extend_schema(
        summary="List Students",
        description="Returns list of students filtered by grade/section for the tenant organization.",
        responses={200: StudentSerializer(many=True)}
    )
    def get(self, request):
        if not request.user.organization_id:
            return Response([], status=status.HTTP_200_OK)
        students = get_students_for_org(
            str(request.user.organization_id),
            grade=request.query_params.get('grade'),
            section=request.query_params.get('section')
        )
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Enroll Student",
        description="Creates a new student record.",
        request=StudentSerializer,
        responses={201: StudentSerializer}
    )
    def post(self, request):
        serializer = StudentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student = create_student(request.user.organization, serializer.validated_data)
        return Response(StudentSerializer(student).data, status=status.HTTP_201_CREATED)

class StudentDetailView(APIView):
    """Retrieve and update specific student record."""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StudentSerializer

    @extend_schema(summary="Get Student Detail", responses={200: StudentSerializer})
    def get(self, request, pk):
        student = get_student_by_id(pk)
        if not student or (request.user.organization_id and student.organization_id != request.user.organization_id):
            return Response({"detail": "Student not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(StudentSerializer(student).data, status=status.HTTP_200_OK)

    @extend_schema(summary="Update Student", request=StudentSerializer, responses={200: StudentSerializer})
    def patch(self, request, pk):
        student = get_student_by_id(pk)
        if not student or (request.user.organization_id and student.organization_id != request.user.organization_id):
            return Response({"detail": "Student not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = StudentSerializer(student, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = update_student(student, serializer.validated_data)
        return Response(StudentSerializer(updated).data, status=status.HTTP_200_OK)

class AdmissionApplicationListCreateView(APIView):
    """Manage admissions applications."""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AdmissionApplicationSerializer

    def get(self, request):
        if not request.user.organization_id:
            return Response([], status=status.HTTP_200_OK)
        apps = get_admission_applications_for_org(str(request.user.organization_id))
        return Response(AdmissionApplicationSerializer(apps, many=True).data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = AdmissionApplicationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        app = submit_admission_application(request.user.organization, serializer.validated_data)
        return Response(AdmissionApplicationSerializer(app).data, status=status.HTTP_201_CREATED)
