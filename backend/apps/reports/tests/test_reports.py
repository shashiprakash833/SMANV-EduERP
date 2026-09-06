from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.organizations.models import Organization
from apps.accounts.models import User, UserRole
from apps.reports.models import ReportMetric

class ReportsModuleTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.org = Organization.objects.create(name="Reports Test School", type="school")
        self.user = User.objects.create_user(
            email="admin@reports.edu",
            password="Password123!",
            role=UserRole.ORG_ADMIN,
            organization=self.org
        )
        self.client.force_authenticate(user=self.user)

    def test_executive_summary_and_export(self):
        ReportMetric.objects.create(
            organization=self.org,
            title="Total Revenue",
            category="financial",
            value="₹45.2 Lakhs",
            change="+12.4%",
            trend="up"
        )
        res = self.client.get('/api/v1/reports/executive-summary/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

        pdf_res = self.client.post('/api/v1/reports/export/pdf/')
        self.assertEqual(pdf_res.status_code, status.HTTP_200_OK)
