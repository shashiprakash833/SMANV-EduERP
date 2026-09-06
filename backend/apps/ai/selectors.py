from typing import Optional
from django.db.models import QuerySet
from .models import AIInsight

def get_insights(organization_id: str, insight_type: str = None) -> QuerySet[AIInsight]:
    qs = AIInsight.objects.filter(organization_id=organization_id)
    if insight_type:
        qs = qs.filter(type=insight_type)
    return qs
