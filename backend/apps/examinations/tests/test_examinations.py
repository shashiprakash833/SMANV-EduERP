from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from apps.organizations.models import Organization
from apps.accounts.models import User, UserRole
from apps.examinations.models import Examination

class ExaminationModuleTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.org = Organization.objects.create(name="Exam Test School", type="school")
        self.user = User.objects.create_user(
            email="staff@exams.edu",
            password="Password123!",
            role=UserRole.STAFF,
            organization=self.org
        )
        self.client.force_authenticate(user=self.user)

    def test_list_and_create_examination(self):
        Examination.objects.create(
            organization=self.org,
            title="Mid-Term Math Exam",
            subject="Mathematics",
            grade="10",
            date=timezone.now().date(),
            start_time="09:00 AM",
            end_time="12:00 PM",
            room="Auditorium"
        )
        res = self.client.get('/api/v1/examinations/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]['title'], "Mid-Term Math Exam")
