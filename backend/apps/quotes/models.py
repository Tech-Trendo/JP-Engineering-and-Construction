from django.db import models
from apps.core.models import TimeStampedModel


class QuoteRequest(TimeStampedModel):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('closed', 'Closed'),
    ]

    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    company = models.CharField(max_length=255, blank=True)
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='quote_requests',
        help_text='Optional product for inquiry; leave empty for general inquiries'
    )
    message = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='new'
    )

    class Meta:
        verbose_name = 'Quote Request'
        verbose_name_plural = 'Quote Requests'
        ordering = ['-created_at']

    def __str__(self):
        target = self.product.name if self.product else "General"
        return f"Quote #{self.id} - {self.full_name} ({target}) [{self.get_status_display()}]"
