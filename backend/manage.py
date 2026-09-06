#!/usr/bin/env python
"""
Django's command-line utility for administrative tasks.
SMANV EduERP - SMANV Info Tech Private Limited
"""
import os
import sys
from pathlib import Path

def main():
    """Run administrative tasks."""
    base_dir = Path(__file__).resolve().parent

    # Load environment variables from .env
    try:
        from dotenv import load_dotenv
        load_dotenv(base_dir / '.env')
    except ImportError:
        pass

    # Ensure apps directory is on sys.path
    apps_dir = base_dir / 'apps'
    if str(apps_dir) not in sys.path:
        sys.path.insert(0, str(apps_dir))
    if str(base_dir) not in sys.path:
        sys.path.insert(0, str(base_dir))

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
