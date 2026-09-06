from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.organizations.models import Organization
from apps.accounts.models import User, UserRole
from apps.notifications.models import NotificationItem

class NotificationModuleTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.org = Organization.objects.create(name="Notification Test School", type="school")
        self.user = User.objects.create_user(
            email="staff@notifs.edu",
            password="Password123!",
            role=UserRole.STAFF,
            organization=self.org
        )
        self.client.force_authenticate(user=self.user)

    def test_list_and_read_notifications(self):
        notif = NotificationItem.objects.create(
            organization=self.org,
            title="Meeting Tomorrow",
            message="Staff meeting at 9am",
            category="General"
        )
        res = self.client.get('/api/v1/notifications/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

        read_res = self.client.post(f'/api/v1/notifications/{notif.id}/read/')
        self.assertEqual(read_res.status_code, status.HTTP_200_OK)
        notif.refresh_from_db()
        self.assertTrue(notif.is_read)
