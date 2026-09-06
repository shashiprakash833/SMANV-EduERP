"""
Testing Settings for SMANV EduERP Backend
Optimized for rapid unit and integration test execution.
"""
from .base import *  # noqa: F403

DEBUG = False

# Fast password hasher for instant test user creation
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Dedicated in-memory SQLite database for deterministic tests
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# In-memory email backend for testing
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
