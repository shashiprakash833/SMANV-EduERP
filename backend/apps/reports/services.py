from typing import Dict, Any
from .models import ReportMetric
from apps.organizations.models import Organization

def upsert_metric(organization: Organization, title: str, category: str, value: str, change: str = "+0.0%", trend: str = "neutral") -> ReportMetric:
    metric, _ = ReportMetric.objects.update_or_create(
        organization=organization,
        title=title,
        defaults={'category': category, 'value': value, 'change': change, 'trend': trend}
    )
    return metric
