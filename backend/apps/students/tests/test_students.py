from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.organizations.models import Organization
from apps.accounts.models import User, UserRole
from apps.students.models import Student

class StudentModuleTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.org = Organization.objects.create(name="Test Academy", type="school")
        self.user = User.objects.create_user(
            email="staff@testacademy.edu",
            password="Password123!",
            role=UserRole.STAFF,
            organization=self.org
        )
        self.client.force_authenticate(user=self.user)

    def test_create_and_list_student(self):
        student = Student.objects.create(
            organization=self.org,
            name="Rahul Sharma",
            roll_number="101",
            grade="10",
            section="A",
            parent_name="Mr. Sharma",
            parent_phone="9999900000"
        )
        res = self.client.get('/api/v1/students/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]['name'], "Rahul Sharma")
