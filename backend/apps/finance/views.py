from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from .serializers import FeeRecordSerializer, CollectFeeSerializer
from .selectors import get_fee_records, get_fee_defaulters
from .services import collect_fee_payment
from .models import FeeRecord

class FeeRecordsListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FeeRecordSerializer

    @extend_schema(summary="List Fee Records", responses={200: FeeRecordSerializer(many=True)})
    def get(self, request):
        if not request.user.organization_id:
            return Response([], status=status.HTTP_200_OK)
        records = get_fee_records(str(request.user.organization_id), status=request.query_params.get('status'))
        return Response(FeeRecordSerializer(records, many=True).data, status=status.HTTP_200_OK)

class FeeCollectView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CollectFeeSerializer

    @extend_schema(summary="Collect Fee Payment", request=CollectFeeSerializer)
    def post(self, request):
        serializer = CollectFeeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        fee_record = FeeRecord.objects.get(id=serializer.validated_data['fee_record_id'])
        updated = collect_fee_payment(fee_record, serializer.validated_data['payment_mode'])
        return Response(FeeRecordSerializer(updated).data, status=status.HTTP_200_OK)

class FeeDefaultersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(summary="List Fee Defaulters", responses={200: FeeRecordSerializer(many=True)})
    def get(self, request):
        if not request.user.organization_id:
            return Response([], status=status.HTTP_200_OK)
        defaulters = get_fee_defaulters(str(request.user.organization_id))
        return Response(FeeRecordSerializer(defaulters, many=True).data, status=status.HTTP_200_OK)
