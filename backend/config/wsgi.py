"""
WSGI config for SMANV EduERP Backend
Developed by SMANV Info Tech Private Limited
"""

import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

try:
    from dotenv import load_dotenv
    load_dotenv(BASE_DIR / '.env')
except ImportError:
    pass

apps_dir = BASE_DIR / 'apps'
if str(apps_dir) not in sys.path:
    sys.path.insert(0, str(apps_dir))
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()
