from django.contrib import admin
from django.shortcuts import redirect
from django.urls import reverse
from .models import SiteSettings


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Company Identity", {
            "fields": (
                "company_name",
                "company_short_name",
                "tagline",
                "company_description",
                "founding_year",
                "company_type",
                "registration_number",
                "pan_vat_number",
                "employee_count",
            )
        }),
        ("Contact Information & Business Hours", {
            "fields": (
                "primary_phone",
                "secondary_phone",
                "primary_email",
                "secondary_email",
                "address",
                "business_hours",
                "map_location_text",
            )
        }),
        ("Social Media Links", {
            "fields": (
                "facebook_url",
                "twitter_url",
                "linkedin_url",
                "youtube_url",
            )
        }),
        ("Homepage Hero Section", {
            "fields": (
                "hero_badge",
                "hero_heading",
                "hero_subtext",
                "hero_image",
                ("hero_cta_primary_label", "hero_cta_primary_link"),
                ("hero_cta_secondary_label", "hero_cta_secondary_link"),
            )
        }),
        ("Homepage Stats & Metrics", {
            "description": "These values drive the statistics bar on the homepage and about pages.",
            "fields": (
                ("stat_years_experience", "stat_projects_completed"),
                ("stat_happy_clients", "stat_business_sectors"),
            )
        }),
        ("Homepage Bottom CTA Banner", {
            "fields": (
                "cta_heading",
                "cta_subtext",
                ("cta_button_label", "cta_button_link"),
            )
        }),
    )

    def changelist_view(self, request, extra_context=None):
        """
        Redirect the changelist view directly to the single editable change form.
        """
        obj = SiteSettings.get_solo()
        change_url = reverse(
            f"admin:{self.model._meta.app_label}_{self.model._meta.model_name}_change",
            args=[obj.pk]
        )
        return redirect(change_url)

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
