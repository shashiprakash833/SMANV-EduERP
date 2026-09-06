from rest_framework import serializers
from .models import Examination, ExamResult

class ExaminationSerializer(serializers.ModelSerializer):
    startTime = serializers.CharField(source='start_time', read_only=True)
    endTime = serializers.CharField(source='end_time', read_only=True)
    maxMarks = serializers.IntegerField(source='max_marks', read_only=True)
    passPercentage = serializers.IntegerField(source='pass_percentage', read_only=True)

    class Meta:
        model = Examination
        fields = [
            'id', 'title', 'subject', 'grade', 'date', 'start_time', 'startTime',
            'end_time', 'endTime', 'room', 'max_marks', 'maxMarks',
            'pass_percentage', 'passPercentage', 'status'
        ]

class ExamResultSerializer(serializers.ModelSerializer):
    studentName = serializers.CharField(source='student.name', read_only=True)
    rollNumber = serializers.CharField(source='student.roll_number', read_only=True)

    class Meta:
        model = ExamResult
        fields = ['id', 'examination', 'student', 'studentName', 'rollNumber', 'marks_obtained', 'grade_letter', 'remarks']
