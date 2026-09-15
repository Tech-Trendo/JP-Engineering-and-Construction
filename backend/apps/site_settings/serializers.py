from __future__ import annotations

from rest_framework import serializers
from .models import SiteSettings, HeroSlide


class SiteSettingsSerializer(serializers.ModelSerializer):
    hero_image_url = serializers.SerializerMethodField()
    logo_url = serializers.SerializerMethodField()
    iso_certificate_image_url = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = [
            'id',
            'company_name',
            'company_short_name',
            'logo',
            'logo_url',
            'tagline',
            'company_description',
            'founding_year',
            'company_type',
            'registration_number',
            'pan_vat_number',
            'employee_count',
            'primary_phone',
            'secondary_phone',
            'primary_email',
            'secondary_email',
            'address',
            'business_hours',
            'map_location_text',
            'facebook_url',
            'twitter_url',
            'linkedin_url',
            'youtube_url',
            'hero_badge',
            'hero_heading',
            'hero_subtext',
            'hero_image',
            'hero_image_url',
            'hero_cta_primary_label',
            'hero_cta_primary_link',
            'hero_cta_secondary_label',
            'hero_cta_secondary_link',
            'stat_years_experience',
            'stat_projects_completed',
            'stat_happy_clients',
            'stat_business_sectors',
            'cta_heading',
            'cta_subtext',
            'cta_button_label',
            'cta_button_link',
            'iso_certified',
            'iso_standard',
            'iso_certificate_number',
            'iso_certificate_image',
            'iso_certificate_image_url',
            'iso_scope',
            'iso_accreditation',
            'iso_issue_date',
            'iso_expiry_date',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'hero_image_url', 'logo_url', 'iso_certificate_image_url']

    def get_hero_image_url(self, obj) -> str | None:
        if obj.hero_image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.hero_image.url)
            return obj.hero_image.url
        return None

    def get_logo_url(self, obj) -> str | None:
        if obj.logo:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return None

    def get_iso_certificate_image_url(self, obj) -> str | None:
        if obj.iso_certificate_image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.iso_certificate_image.url)
            return obj.iso_certificate_image.url
        return None


class HeroSlideSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = HeroSlide
        fields = [
            'id',
            'title',
            'badge',
            'heading',
            'subtext',
            'image',
            'image_url',
            'primary_cta_label',
            'primary_cta_link',
            'secondary_cta_label',
            'secondary_cta_link',
            'order',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'image_url']

    def get_image_url(self, obj) -> str | None:
        if obj.image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

