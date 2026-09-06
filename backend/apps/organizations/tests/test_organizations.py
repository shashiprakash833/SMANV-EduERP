from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.accounts.models import User, UserRole
from apps.organizations.models import Organization, OrganizationStatus

class OrganizationEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.password = "SecurePassword123!"

        self.org = Organization.objects.create(
            name="Apex World School",
            type="school",
            status=OrganizationStatus.ACTIVE,
            city="Hyderabad",
            state="Telangana",
            pincode="500001"
        )

        self.admin_user = User.objects.create_user(
            email="admin@apexworld.edu",
            password=self.password,
            first_name="Sanjay",
            last_name="Verma",
            role=UserRole.ORG_ADMIN,
            organization=self.org
        )

        self.student_user = User.objects.create_user(
            email="student@apexworld.edu",
            password=self.password,
            first_name="Aarav",
            last_name="Verma",
            role=UserRole.STUDENT,
            organization=self.org
        )

    def test_get_organization_me_success(self):
        """Test GET /api/v1/organizations/me/ returns current user's organization."""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('org-me')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Apex World School")
        self.assertEqual(response.data['city'], "Hyderabad")

    def test_get_organization_current_alias(self):
        """Test GET /api/v1/organizations/current/ alias returns same organization."""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('org-current')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Apex World School")

    def test_patch_organization_by_admin_permitted(self):
        """Test Organization Admin can update organization details."""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('org-me')
        payload = {
            "city": "Secunderabad",
            "phone": "+91 40 12345678"
        }
        response = self.client.patch(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['city'], "Secunderabad")
        self.org.refresh_from_db()
        self.assertEqual(self.org.city, "Secunderabad")

    def test_patch_organization_by_student_forbidden(self):
        """Test Student role is forbidden from updating organization settings."""
        self.client.force_authenticate(user=self.student_user)
        url = reverse('org-me')
        payload = {"name": "Hacked School"}
        response = self.client.patch(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_organization_blocked(self):
        """Test unauthenticated access to organization endpoint is rejected."""
        url = reverse('org-me')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
