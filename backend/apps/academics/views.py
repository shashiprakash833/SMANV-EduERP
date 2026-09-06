from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from .serializers import ClassSessionSerializer, AssignmentSerializer
from .selectors import get_timetable, get_assignments
from .services import create_class_session, create_assignment

class TimetableListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ClassSessionSerializer

    @extend_schema(summary="Get Class Timetable", responses={200: ClassSessionSerializer(many=True)})
    def get(self, request):
        if not request.user.organization_id:
            return Response([], status=status.HTTP_200_OK)
        sessions = get_timetable(
            str(request.user.organization_id),
            grade=request.query_params.get('grade'),
            section=request.query_params.get('section')
        )
        return Response(ClassSessionSerializer(sessions, many=True).data, status=status.HTTP_200_OK)

    @extend_schema(summary="Create Class Session", request=ClassSessionSerializer, responses={201: ClassSessionSerializer})
    def post(self, request):
        serializer = ClassSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        session = create_class_session(request.user.organization, serializer.validated_data)
        return Response(ClassSessionSerializer(session).data, status=status.HTTP_201_CREATED)

class AssignmentListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AssignmentSerializer

    @extend_schema(summary="List Assignments", responses={200: AssignmentSerializer(many=True)})
    def get(self, request):
        if not request.user.organization_id:
            return Response([], status=status.HTTP_200_OK)
        assignments = get_assignments(
            str(request.user.organization_id),
            grade=request.query_params.get('grade')
        )
        return Response(AssignmentSerializer(assignments, many=True).data, status=status.HTTP_200_OK)

    @extend_schema(summary="Create Assignment", request=AssignmentSerializer, responses={201: AssignmentSerializer})
    def post(self, request):
        serializer = AssignmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        assignment = create_assignment(request.user.organization, serializer.validated_data)
        return Response(AssignmentSerializer(assignment).data, status=status.HTTP_201_CREATED)
