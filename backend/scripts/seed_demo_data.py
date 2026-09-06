"""
SMANV EduERP Demo Data Seeding Script
Initializes sample tenant organization and demo users for local development.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.organizations.models import Organization, OrganizationType, OrganizationStatus
from apps.accounts.models import User, UserRole

def seed():
    print("Seeding demo tenant organization...")
    org, created = Organization.objects.get_or_create(
        name="SMANV International Academy",
        defaults={
            "type": OrganizationType.SCHOOL,
            "code": "SMANV01",
            "email": "info@smanv.edu",
            "phone": "+91 99999 11111",
            "city": "Bengaluru",
            "state": "Karnataka",
            "pincode": "560001",
            "status": OrganizationStatus.ACTIVE,
            "student_count": 1250,
            "staff_count": 85,
        }
    )

    print(f"Organization: {org.name} ({'Created' if created else 'Existing'})")

    demo_profiles = [
        ("admin@smanv.edu", "AdminPass123!", "Admin", "User", UserRole.ORG_ADMIN),
        ("staff@smanv.edu", "StaffPass123!", "Priya", "Sharma", UserRole.STAFF),
        ("student@smanv.edu", "StudentPass123!", "Aarav", "Patel", UserRole.STUDENT),
        ("parent@smanv.edu", "ParentPass123!", "Vikram", "Patel", UserRole.PARENT),
        ("finance@smanv.edu", "FinancePass123!", "Kavita", "Menon", UserRole.FINANCE),
    ]

    for email, password, first_name, last_name, role in demo_profiles:
        if not User.objects.filter(email=email).exists():
            u = User.objects.create_user(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                role=role,
                organization=org,
                is_active=True,
                is_verified=True,
            )
            print(f"Created demo user: {email} [{role}]")
        else:
            print(f"User already exists: {email}")

    print("Demo data seeding completed successfully!")

if __name__ == '__main__':
    seed()
