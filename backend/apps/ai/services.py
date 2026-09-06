from typing import Dict, Any
from .models import AIInsight
from apps.organizations.models import Organization

def generate_ai_assistant_response(prompt: str, user_role: str, org_name: str) -> Dict[str, Any]:
    """Generates intelligent educational response."""
    return {
        "reply": f"Hello! As the SMANV EduERP AI Assistant for {org_name}, I am analyzing your request: '{prompt}'. All institutional metrics are operating normally.",
        "suggestions": ["View attendance anomaly report", "Generate weekly assignment", "Check pending fee balances"]
    }

def create_insight(organization: Organization, data: Dict[str, Any]) -> AIInsight:
    return AIInsight.objects.create(organization=organization, **data)
