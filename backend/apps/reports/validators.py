from rest_framework.exceptions import ValidationError

def validate_metric_title(title: str) -> None:
    if not title:
        raise ValidationError("Metric title is required.")
