import uuid
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from apps.organizations.models import Organization
from apps.accounts.models import User, UserRole
from apps.attendance.models import AttendanceRecord

class AttendanceModuleTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.org = Organization.objects.create(name="Attendance Test School", type="school")
        self.user = User.objects.create_user(
            email="teacher@test.edu",
            password="Password123!",
            role=UserRole.STAFF,
            organization=self.org
        )
        self.client.force_authenticate(user=self.user)

    def test_summary_and_batch_mark(self):
        today = str(timezone.now().date())
        payload = {
            "date": today,
            "records": [
                {
                    "entity_id": str(uuid.uuid4()),
                    "entity_name": "Student A",
                    "entity_type": "student",
                    "status": "Present",
                    "grade": "10",
                    "section": "A"
                }
            ]
        }
        res = self.client.post('/api/v1/attendance/mark-batch/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['count'], 1)

        summary_res = self.client.get(f'/api/v1/attendance/summary/?date={today}')
        self.assertEqual(summary_res.status_code, status.HTTP_200_OK)
        self.assertEqual(summary_res.data['total'], 1)
        self.assertEqual(summary_res.data['present'], 1)
