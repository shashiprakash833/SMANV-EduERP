"""
Production Settings for SMANV EduERP Backend
"""
import os
from .base import *  # noqa: F403

DEBUG = False

# Ensure SECRET_KEY is set via environment variable
SECRET_KEY = os.environ['SECRET_KEY']

ALLOWED_HOSTS = [h.strip() for h in os.environ['ALLOWED_HOSTS'].split(',') if h.strip()]

# HTTPS Security Headers
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = os.getenv('SECURE_SSL_REDIRECT', 'True').lower() in ('true', '1', 't')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Strict CORS in production
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    h.strip() for h in os.getenv('CORS_ALLOWED_ORIGINS', '').split(',') if h.strip()
]
