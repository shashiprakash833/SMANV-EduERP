from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from .serializers import AIInsightSerializer, AIChatSerializer
from .selectors import get_insights
from .services import generate_ai_assistant_response

class AIInsightsListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AIInsightSerializer

    @extend_schema(summary="Get AI Insights", responses={200: AIInsightSerializer(many=True)})
    def get(self, request):
        if not request.user.organization_id:
            return Response([], status=status.HTTP_200_OK)
        insights = get_insights(str(request.user.organization_id), insight_type=request.query_params.get('type'))
        return Response(AIInsightSerializer(insights, many=True).data, status=status.HTTP_200_OK)

class AIAssistantChatView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AIChatSerializer

    @extend_schema(summary="Chat with AI Assistant", request=AIChatSerializer)
    def post(self, request):
        serializer = AIChatSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reply = generate_ai_assistant_response(
            serializer.validated_data['message'],
            request.user.role,
            request.user.organization.name if request.user.organization else "EduERP"
        )
        return Response(reply, status=status.HTTP_200_OK)
