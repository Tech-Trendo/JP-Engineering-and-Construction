from django.contrib import admin
from .models import SiteContent


@admin.register(SiteContent)
class SiteContentAdmin(admin.ModelAdmin):
    list_display = ('title', 'updated_at')

    def has_add_permission(self, request):
        # Enforce singleton in Django admin
        if SiteContent.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False
