from rest_framework import serializers
from .models import ClassSession, Assignment

class ClassSessionSerializer(serializers.ModelSerializer):
    startTime = serializers.CharField(source='start_time', read_only=True)
    endTime = serializers.CharField(source='end_time', read_only=True)
    teacherName = serializers.CharField(source='teacher_name', read_only=True)

    class Meta:
        model = ClassSession
        fields = [
            'id', 'period', 'start_time', 'startTime', 'end_time', 'endTime',
            'subject', 'grade', 'section', 'room', 'teacher_name', 'teacherName', 'status'
        ]

class AssignmentSerializer(serializers.ModelSerializer):
    dueDate = serializers.DateField(source='due_date', read_only=True)
    assignedDate = serializers.DateField(source='assigned_date', read_only=True)
    totalMarks = serializers.IntegerField(source='total_marks', read_only=True)
    submissionsCount = serializers.IntegerField(source='submissions_count', read_only=True)
    totalStudents = serializers.IntegerField(source='total_students', read_only=True)

    class Meta:
        model = Assignment
        fields = [
            'id', 'title', 'subject', 'grade', 'section', 'due_date', 'dueDate',
            'assigned_date', 'assignedDate', 'total_marks', 'totalMarks',
            'submissions_count', 'submissionsCount', 'total_students', 'totalStudents',
            'status', 'description'
        ]
