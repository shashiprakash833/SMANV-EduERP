from typing import Optional
from django.db.models import QuerySet
from .models import ReportMetric

def get_report_metrics(organization_id: str, category: str = None) -> QuerySet[ReportMetric]:
    qs = ReportMetric.objects.filter(organization_id=organization_id)
    if category:
        qs = qs.filter(category=category)
    return qs
