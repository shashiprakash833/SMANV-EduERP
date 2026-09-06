from django.urls import path
from .views import AIInsightsListView, AIAssistantChatView

urlpatterns = [
    path('insights/', AIInsightsListView.as_view(), name='ai-insights'),
    path('assistant/chat/', AIAssistantChatView.as_view(), name='ai-chat'),
]
