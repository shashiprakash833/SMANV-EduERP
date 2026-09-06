from django.urls import path
from .views import CurrentOrganizationView
from apps.accounts.views import RegisterView

urlpatterns = [
    # Dual compatibility routes for current organization
    path('me/', CurrentOrganizationView.as_view(), name='org-me'),
    path('current/', CurrentOrganizationView.as_view(), name='org-current'),
    path('settings/', CurrentOrganizationView.as_view(), name='org-settings'),

    # Registration endpoint alias matching frontend Endpoints.auth.registerOrg
    path('register/', RegisterView.as_view(), name='org-register-alias'),
]
