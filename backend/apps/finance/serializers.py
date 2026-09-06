from rest_framework import serializers
from .models import FeeRecord

class FeeRecordSerializer(serializers.ModelSerializer):
    receiptNumber = serializers.CharField(source='receipt_number', read_only=True)
    studentId = serializers.UUIDField(source='student.id', read_only=True)
    studentName = serializers.CharField(source='student.name', read_only=True)
    grade = serializers.CharField(source='student.grade', read_only=True)
    section = serializers.CharField(source='student.section', read_only=True)
    dueDate = serializers.DateField(source='due_date', read_only=True)
    paidDate = serializers.DateField(source='paid_date', read_only=True)
    paymentMode = serializers.CharField(source='payment_mode', read_only=True)
    qrCode = serializers.CharField(source='qr_code', read_only=True)

    class Meta:
        model = FeeRecord
        fields = [
            'id', 'receipt_number', 'receiptNumber', 'student', 'studentId',
            'studentName', 'grade', 'section', 'category', 'amount', 'due_date',
            'dueDate', 'paid_date', 'paidDate', 'status', 'payment_mode',
            'paymentMode', 'qr_code', 'qrCode'
        ]

class CollectFeeSerializer(serializers.Serializer):
    fee_record_id = serializers.UUIDField()
    amount_paid = serializers.DecimalField(max_digits=10, decimal_places=2)
    payment_mode = serializers.CharField()
