from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.accounts.models import User, UserRole
from apps.organizations.models import Organization, OrganizationStatus

class AuthEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.password = "SecurePass123!"

        self.org = Organization.objects.create(
            name="Delhi Public Academy",
            type="school",
            status=OrganizationStatus.ACTIVE,
            city="Delhi",
            state="Delhi",
            pincode="110001"
        )

        self.user = User.objects.create_user(
            email="admin@delhipublic.edu",
            password=self.password,
            first_name="Rajesh",
            last_name="Sharma",
            role=UserRole.ORG_ADMIN,
            organization=self.org,
            is_active=True,
            is_verified=True
        )

    def test_login_success_primary_endpoint(self):
        """Test POST /api/v1/auth/login/ returns JWT tokens and user profile."""
        url = reverse('auth-login')
        response = self.client.post(url, {
            'email': 'admin@delhipublic.edu',
            'password': self.password
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], 'admin@delhipublic.edu')
        self.assertEqual(response.data['user']['role'], 'org_admin')
        self.assertIn('organization', response.data)
        self.assertEqual(response.data['organization']['name'], 'Delhi Public Academy')

    def test_login_success_frontend_alias_endpoint(self):
        """Test POST /api/v1/auth/token/ returns JWT tokens (matching frontend Endpoints.auth.login)."""
        url = reverse('auth-token')
        response = self.client.post(url, {
            'username': 'admin@delhipublic.edu',
            'email': 'admin@delhipublic.edu',
            'password': self.password
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('tokens', response.data)

    def test_login_invalid_password(self):
        """Test login fails with incorrect password."""
        url = reverse('auth-login')
        response = self.client.post(url, {
            'email': 'admin@delhipublic.edu',
            'password': 'WrongPassword!'
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', response.data)

    def test_login_inactive_user_blocked(self):
        """Test inactive user is blocked from logging in."""
        self.user.is_active = False
        self.user.save()

        url = reverse('auth-login')
        response = self.client.post(url, {
            'email': 'admin@delhipublic.edu',
            'password': self.password
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_inactive_org_blocked(self):
        """Test user belonging to inactive organization is blocked from logging in."""
        self.org.status = OrganizationStatus.INACTIVE
        self.org.save()

        url = reverse('auth-login')
        response = self.client.post(url, {
            'email': 'admin@delhipublic.edu',
            'password': self.password
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('organization', str(response.data).lower())

    def test_token_refresh_workflow(self):
        """Test token refresh rotates tokens successfully."""
        # 1. Login to get tokens
        login_res = self.client.post(reverse('auth-login'), {
            'email': 'admin@delhipublic.edu',
            'password': self.password
        }, format='json')
        refresh_token = login_res.data['refresh']

        # 2. Refresh token
        refresh_url = reverse('auth-refresh')
        refresh_res = self.client.post(refresh_url, {'refresh': refresh_token}, format='json')
        self.assertEqual(refresh_res.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh_res.data)

    def test_current_user_profile_me(self):
        """Test GET /api/v1/auth/me/ with Bearer token."""
        login_res = self.client.post(reverse('auth-login'), {
            'email': 'admin@delhipublic.edu',
            'password': self.password
        }, format='json')
        access_token = login_res.data['access']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        me_res = self.client.get(reverse('auth-me'))

        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        self.assertEqual(me_res.data['email'], 'admin@delhipublic.edu')
        self.assertEqual(me_res.data['name'], 'Rajesh Sharma')
        self.assertIn('organization', me_res.data)

    def test_logout_blacklists_token(self):
        """Test POST /api/v1/auth/logout/ invalidates refresh token."""
        login_res = self.client.post(reverse('auth-login'), {
            'email': 'admin@delhipublic.edu',
            'password': self.password
        }, format='json')
        refresh_token = login_res.data['refresh']

        logout_res = self.client.post(reverse('auth-logout'), {
            'refresh': refresh_token
        }, format='json')
        self.assertEqual(logout_res.status_code, status.HTTP_200_OK)

        # Attempt to use blacklisted token should fail
        refresh_res = self.client.post(reverse('auth-refresh'), {
            'refresh': refresh_token
        }, format='json')
        self.assertEqual(refresh_res.status_code, status.HTTP_401_UNAUTHORIZED)
