from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from apps.organizations.models import Organization
from apps.accounts.models import User, UserRole
from apps.academics.models import ClassSession, Assignment

class AcademicsModuleTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.org = Organization.objects.create(name="Academics Test School", type="school")
        self.user = User.objects.create_user(
            email="staff@academics.edu",
            password="Password123!",
            role=UserRole.STAFF,
            organization=self.org
        )
        self.client.force_authenticate(user=self.user)

    def test_timetable_and_assignments(self):
        ClassSession.objects.create(
            organization=self.org,
            period=1,
            start_time="08:30 AM",
            end_time="09:15 AM",
            subject="Mathematics",
            grade="10",
            section="A",
            room="Room 101",
            teacher_name="Mr. Sharma"
        )
        res = self.client.get('/api/v1/academics/timetable/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

        Assignment.objects.create(
            organization=self.org,
            title="Algebra Problem Set 1",
            subject="Mathematics",
            grade="10",
            section="A",
            due_date=timezone.now().date()
        )
        ass_res = self.client.get('/api/v1/academics/assignments/')
        self.assertEqual(ass_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(ass_res.data), 1)
