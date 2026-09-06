from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.organizations.models import Organization
from apps.accounts.models import User, UserRole
from apps.staff.models import Staff

class StaffModuleTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.org = Organization.objects.create(name="Test University", type="college")
        self.user = User.objects.create_user(
            email="admin@testuni.edu",
            password="Password123!",
            role=UserRole.ORG_ADMIN,
            organization=self.org
        )
        self.client.force_authenticate(user=self.user)

    def test_create_and_list_staff(self):
        Staff.objects.create(
            organization=self.org,
            name="Prof. Sharma",
            employee_code="EMP001",
            department="Computer Science",
            designation="Professor",
            email="sharma@testuni.edu",
            phone="9876543210"
        )
        res = self.client.get('/api/v1/staff/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]['name'], "Prof. Sharma")
