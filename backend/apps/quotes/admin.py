from django.contrib import admin
from .models import QuoteRequest


@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'full_name',
        'email',
        'phone',
        'company',
        'product',
        'status',
        'created_at',
    )
    list_filter = ('status', 'created_at')
    search_fields = ('full_name', 'email', 'phone', 'company', 'message')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
