from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.accounts.models import User, UserRole
from apps.organizations.models import Organization

class RegistrationEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_organization_nested_payload(self):
        """Test registration using nested payload matching frontend registerOrgApi."""
        url = reverse('auth-register')
        payload = {
            "organization": {
                "name": "Greenwood International School",
                "type": "school",
                "email": "info@greenwood.edu",
                "phone": "+91 98765 00000",
                "address": "45 Knowledge Park",
                "city": "Bengaluru",
                "state": "Karnataka",
                "pincode": "560001"
            },
            "admin": {
                "name": "Ananya Roy",
                "email": "ananya@greenwood.edu",
                "phone": "+91 98765 11111",
                "password": "SecurePassword2026!"
            }
        }

        response = self.client.post(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertIn('organization', response.data)

        # Verify DB records
        self.assertTrue(Organization.objects.filter(name="Greenwood International School").exists())
        user = User.objects.get(email="ananya@greenwood.edu")
        self.assertEqual(user.first_name, "Ananya")
        self.assertEqual(user.last_name, "Roy")
        self.assertEqual(user.role, UserRole.ORG_ADMIN)
        self.assertTrue(user.check_password("SecurePassword2026!"))
        self.assertEqual(user.organization.name, "Greenwood International School")

    def test_register_organization_flat_payload(self):
        """Test registration using top-level flat payload aliases."""
        url = reverse('org-register-alias')
        payload = {
            "org_name": "St. Xavier College",
            "org_type": "college",
            "org_email": "admissions@xavier.edu",
            "org_phone": "+91 99999 12345",
            "org_city": "Mumbai",
            "org_state": "Maharashtra",
            "org_pincode": "400001",
            "admin_name": "Father Joseph",
            "admin_email": "principal@xavier.edu",
            "admin_phone": "+91 99999 54321",
            "password": "XavierCollegePass1!"
        }

        response = self.client.post(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user']['email'], "principal@xavier.edu")
        self.assertEqual(response.data['organization']['name'], "St. Xavier College")
        self.assertEqual(response.data['organization']['type'], "college")

    def test_register_duplicate_email_fails(self):
        """Test duplicate registration with existing email is rejected."""
        User.objects.create_user(
            email="existing@school.edu",
            password="InitialPassword123!",
            first_name="Existing"
        )

        url = reverse('auth-register')
        payload = {
            "organization": {"name": "New School"},
            "admin": {
                "name": "Duplicate Admin",
                "email": "existing@school.edu",
                "password": "Password123!"
            }
        }

        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', str(response.data))
