import uuid
from django.db import models

class UUIDModel(models.Model):
    """Abstract model providing a UUID primary key."""
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier"
    )

    class Meta:
        abstract = True

class TimeStampedModel(UUIDModel):
    """Abstract model providing self-updating created_at and updated_at timestamps."""
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['-created_at']
