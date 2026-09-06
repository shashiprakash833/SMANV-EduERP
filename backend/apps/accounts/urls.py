from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    CurrentUserView,
    CustomTokenRefreshView,
)

urlpatterns = [
    # Primary prompt specifications
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
    path('refresh/', CustomTokenRefreshView.as_view(), name='auth-refresh'),
    path('me/', CurrentUserView.as_view(), name='auth-me'),

    # Frontend compatibility aliases (Endpoints.auth in api/client.ts)
    path('token/', LoginView.as_view(), name='auth-token'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='auth-token-refresh'),
    path('user/', CurrentUserView.as_view(), name='auth-user'),
]
