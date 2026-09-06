from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from apps.organizations.models import Organization
from apps.accounts.models import User, UserRole
from apps.students.models import Student
from apps.finance.models import FeeRecord

class FinanceModuleTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.org = Organization.objects.create(name="Finance Test School", type="school")
        self.user = User.objects.create_user(
            email="finance@test.edu",
            password="Password123!",
            role=UserRole.FINANCE,
            organization=self.org
        )
        self.client.force_authenticate(user=self.user)
        self.student = Student.objects.create(
            organization=self.org,
            name="Aarav Sharma",
            roll_number="101",
            grade="10",
            section="A",
            parent_name="Mr. Sharma",
            parent_phone="9999900000"
        )

    def test_fee_record_and_defaulters(self):
        FeeRecord.objects.create(
            organization=self.org,
            receipt_number="REC-001",
            student=self.student,
            category="Tuition",
            amount=15000.00,
            due_date=timezone.now().date(),
            status="Pending"
        )
        res = self.client.get('/api/v1/finance/records/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

        def_res = self.client.get('/api/v1/finance/defaulters/')
        self.assertEqual(def_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(def_res.data), 1)
