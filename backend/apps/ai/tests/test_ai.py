from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.organizations.models import Organization
from apps.accounts.models import User, UserRole
from apps.ai.models import AIInsight

class AIModuleTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.org = Organization.objects.create(name="AI Test School", type="school")
        self.user = User.objects.create_user(
            email="admin@ai.edu",
            password="Password123!",
            role=UserRole.ORG_ADMIN,
            organization=self.org
        )
        self.client.force_authenticate(user=self.user)

    def test_list_insights_and_chat(self):
        AIInsight.objects.create(
            organization=self.org,
            title="Attendance Dip Alert",
            type="attendance",
            severity="warning",
            description="Grade 9 attendance dropped 4% this week",
            recommendation="Review absent student records"
        )
        res = self.client.get('/api/v1/ai/insights/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

        chat_res = self.client.post('/api/v1/ai/assistant/chat/', {'message': 'What is the attendance trend?'}, format='json')
        self.assertEqual(chat_res.status_code, status.HTTP_200_OK)
        self.assertIn('reply', chat_res.data)
