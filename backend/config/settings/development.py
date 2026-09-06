"""
Development Settings for SMANV EduERP Backend
"""
from .base import *  # noqa: F403

DEBUG = True

# In development, accept all hosts
ALLOWED_HOSTS = ['*']

# Enable Console Email Backend for Testing
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
