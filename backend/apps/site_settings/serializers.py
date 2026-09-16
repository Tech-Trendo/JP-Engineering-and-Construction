from __future__ import annotations

from rest_framework import serializers
from .models import SiteSettings, HeroSlide


class SiteSettingsSerializer(serializers.ModelSerializer):
    hero_image_url = serializers.SerializerMethodField()
    logo_url = serializers.SerializerMethodField()
    iso_certified = serializers.SerializerMethodField()
    iso_standard = serializers.SerializerMethodField()
    iso_certificate_number = serializers.SerializerMethodField()
    iso_certificate_image = serializers.SerializerMethodField()
    iso_certificate_image_url = serializers.SerializerMethodField()
    iso_scope = serializers.SerializerMethodField()
    iso_accreditation = serializers.SerializerMethodField()
    iso_issue_date = serializers.SerializerMethodField()
    iso_expiry_date = serializers.SerializerMethodField()

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
            'tiktok_url',
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
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'hero_image_url',
            'logo_url',
            'iso_certified',
            'iso_standard',
            'iso_certificate_number',
            'iso_certificate_image',
            'iso_certificate_image_url',
            'iso_scope',
            'iso_accreditation',
            'iso_issue_date',
            'iso_expiry_date',
        ]

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

    def get_iso_certified(self, obj) -> bool:
        return bool(getattr(obj, 'iso_certified', True))

    def get_iso_standard(self, obj) -> str:
        return getattr(obj, 'iso_standard', "ISO 9001:2015") or "ISO 9001:2015"

    def get_iso_certificate_number(self, obj) -> str:
        return getattr(obj, 'iso_certificate_number', "129594/A/0001/UK/En") or "129594/A/0001/UK/En"

    def get_iso_certificate_image(self, obj) -> str | None:
        val = getattr(obj, 'iso_certificate_image', None)
        if val and hasattr(val, 'name') and val.name:
            return val.name
        return None

    def get_iso_certificate_image_url(self, obj) -> str | None:
        val = getattr(obj, 'iso_certificate_image', None)
        if val and hasattr(val, 'url'):
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(val.url)
            return val.url
        return None

    def get_iso_scope(self, obj) -> str:
        return getattr(
            obj,
            'iso_scope',
            (
                "Manufacturing and Assembly of Reverse Osmosis Plant, Dairy Equipment's "
                "(Pasteurizer, Homogenizer, Chilling Vat, Road Milk Tanker), Cold Storage Equipment's, "
                "Solar Energy & Heat Pump System, Steel Fabrication"
            )
        ) or ""

    def get_iso_accreditation(self, obj) -> str:
        return getattr(
            obj,
            'iso_accreditation',
            "URS / UKAS Management Systems (0043) / IAF Multilateral Recognition Arrangement"
        ) or ""

    def get_iso_issue_date(self, obj) -> str:
        return getattr(obj, 'iso_issue_date', "18 November 2023") or "18 November 2023"

    def get_iso_expiry_date(self, obj) -> str:
        return getattr(obj, 'iso_expiry_date', "17 November 2026") or "17 November 2026"

    def to_internal_value(self, data):
        ret = super().to_internal_value(data)
        iso_keys = [
            'iso_certified',
            'iso_standard',
            'iso_certificate_number',
            'iso_certificate_image',
            'iso_scope',
            'iso_accreditation',
            'iso_issue_date',
            'iso_expiry_date',
        ]
        for k in iso_keys:
            if k in data:
                ret[k] = data[k]
        return ret

    def update(self, instance, validated_data):
        for field in [
            'iso_certified',
            'iso_standard',
            'iso_certificate_number',
            'iso_certificate_image',
            'iso_scope',
            'iso_accreditation',
            'iso_issue_date',
            'iso_expiry_date',
        ]:
            if field in validated_data and hasattr(instance, field):
                setattr(instance, field, validated_data[field])
        return super().update(instance, validated_data)


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

