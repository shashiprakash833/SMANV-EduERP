from rest_framework import status, permissions, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .serializers import NotificationItemSerializer
from .selectors import get_notifications
from .services import mark_notification_as_read, mark_all_notifications_as_read

class NotificationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationItemSerializer

    @extend_schema(summary="List Notifications", responses={200: NotificationItemSerializer(many=True)})
    def get(self, request):
        if not request.user.organization_id:
            return Response([], status=status.HTTP_200_OK)
        notifications = get_notifications(str(request.user.organization_id))
        return Response(NotificationItemSerializer(notifications, many=True).data, status=status.HTTP_200_OK)

class NotificationMarkReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.Serializer

    @extend_schema(summary="Mark Notification as Read", responses={200: OpenApiResponse(description="Success indicator")})
    def post(self, request, pk):
        success = mark_notification_as_read(pk)
        return Response({"success": success}, status=status.HTTP_200_OK)

class NotificationMarkAllReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.Serializer

    @extend_schema(summary="Mark All Notifications as Read", responses={200: OpenApiResponse(description="Count of updated notifications")})
    def post(self, request):
        if not request.user.organization_id:
            return Response({"count": 0}, status=status.HTTP_200_OK)
        count = mark_all_notifications_as_read(str(request.user.organization_id))
        return Response({"count": count}, status=status.HTTP_200_OK)
