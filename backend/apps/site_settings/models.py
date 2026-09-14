from django.db import models
from apps.core.models import TimeStampedModel


class SiteSettings(TimeStampedModel):
    """
    Singleton CMS model for site-wide settings, company info, hero content,
    contact details, social links, and homepage metrics.
    Only one instance is permitted.
    """
    # -------------------------------------------------------------------------
    # Company Identity
    # -------------------------------------------------------------------------
    company_name = models.CharField(
        max_length=255,
        default="JP Engineering & Construction Pvt. Ltd.",
        help_text="Full registered company name."
    )
    company_short_name = models.CharField(
        max_length=100,
        default="JP Engineering & Construction Pvt. Ltd.",
        help_text="Short brand name / acronym displayed in the logo and navbar."
    )
    logo = models.ImageField(
        upload_to="site_settings/logo/",
        blank=True,
        null=True,
        help_text="Official company logo image. If omitted, default logo is used."
    )
    tagline = models.CharField(
        max_length=255,
        default="A trusted name in Nepal's engineering sector",
        help_text="Company tagline or slogan."
    )
    company_description = models.TextField(
        default=(
            "A leading engineering company in Nepal specializing in cold storage, "
            "water systems, dairy processing, steel fabrication, solar energy, and construction."
        ),
        help_text="Brief company description used across the footer and meta tags."
    )
    founding_year = models.CharField(
        max_length=10,
        default="1998",
        help_text="Year the company was established (e.g. 1998)."
    )
    company_type = models.CharField(
        max_length=100,
        default="Private Limited",
        help_text="e.g. Private Limited"
    )
    registration_number = models.CharField(
        max_length=100,
        default="",
        blank=True,
        help_text="Company registration number."
    )
    pan_vat_number = models.CharField(
        max_length=50,
        default="",
        blank=True,
        help_text="PAN/VAT registration number."
    )
    employee_count = models.CharField(
        max_length=50,
        default="150+",
        help_text="e.g. 150+"
    )

    # -------------------------------------------------------------------------
    # Contact Information
    # -------------------------------------------------------------------------
    primary_phone = models.CharField(
        max_length=50,
        default="01-5385552",
        help_text="Primary telephone number displayed in top bar and footer."
    )
    secondary_phone = models.CharField(
        max_length=255,
        default="9851112988, 9851158661, 9851158660",
        blank=True,
        help_text="Secondary mobile/contact numbers."
    )
    primary_email = models.EmailField(
        default="info@jpec.com.np",
        help_text="Primary email address for inquiries."
    )
    secondary_email = models.EmailField(
        default="",
        blank=True,
        help_text="Secondary email address."
    )
    address = models.CharField(
        max_length=255,
        default="Kathmandu, Nepal",
        help_text="Physical head office address."
    )
    business_hours = models.CharField(
        max_length=100,
        default="Mon - Sat: 9:00 AM - 6:00 PM",
        help_text="Operating business hours."
    )
    map_location_text = models.TextField(
        default=(
            "Kathmandu, Nepal"
        ),
        help_text="Directions / location guidance text for the contact page."
    )

    # -------------------------------------------------------------------------
    # Social Media Links
    # -------------------------------------------------------------------------
    facebook_url = models.URLField(
        blank=True,
        default="https://facebook.com",
        help_text="Facebook page URL."
    )
    twitter_url = models.URLField(
        blank=True,
        default="https://twitter.com",
        help_text="Twitter / X profile URL."
    )
    linkedin_url = models.URLField(
        blank=True,
        default="https://linkedin.com",
        help_text="LinkedIn page URL."
    )
    youtube_url = models.URLField(
        blank=True,
        default="https://youtube.com",
        help_text="YouTube channel URL."
    )

    # -------------------------------------------------------------------------
    # Hero Section
    # -------------------------------------------------------------------------
    hero_badge = models.CharField(
        max_length=100,
        default="Engineering Excellence",
        help_text="Small badge text above the hero heading."
    )
    hero_heading = models.CharField(
        max_length=255,
        default="JP Engineering & Construction Pvt. Ltd.",
        help_text="Main heading on the homepage hero."
    )
    hero_subtext = models.TextField(
        default=(
            "A trusted name in Nepal's engineering sector — delivering integrated solutions in "
            "cold storage, water treatment, dairy processing, steel fabrication, renewable "
            "energy, and construction since 1998."
        ),
        help_text="Hero paragraph text."
    )
    hero_image = models.ImageField(
        upload_to="site_settings/hero/",
        blank=True,
        null=True,
        help_text="Optional custom hero background image. If omitted, default image is used."
    )
    hero_cta_primary_label = models.CharField(
        max_length=50,
        default="About Us",
        help_text="Label for primary hero CTA button."
    )
    hero_cta_primary_link = models.CharField(
        max_length=255,
        default="/about/introduction",
        help_text="URL or path for primary hero CTA button."
    )
    hero_cta_secondary_label = models.CharField(
        max_length=50,
        default="Contact Us",
        help_text="Label for secondary hero CTA button."
    )
    hero_cta_secondary_link = models.CharField(
        max_length=255,
        default="/contact-us",
        help_text="URL or path for secondary hero CTA button."
    )

    # -------------------------------------------------------------------------
    # Homepage Stats / Metrics
    # -------------------------------------------------------------------------
    stat_years_experience = models.CharField(
        max_length=20,
        default="25+",
        help_text="Years of experience counter display (e.g. '25+')."
    )
    stat_projects_completed = models.CharField(
        max_length=20,
        default="500+",
        help_text="Projects completed counter display (e.g. '500+')."
    )
    stat_happy_clients = models.CharField(
        max_length=20,
        default="300+",
        help_text="Happy clients counter display (e.g. '300+')."
    )
    stat_business_sectors = models.CharField(
        max_length=20,
        default="6",
        help_text="Business sectors counter display (e.g. '6')."
    )

    # -------------------------------------------------------------------------
    # Homepage Bottom CTA
    # -------------------------------------------------------------------------
    cta_heading = models.CharField(
        max_length=255,
        default="Ready to Start Your Project?",
        help_text="Heading for bottom CTA banner."
    )
    cta_subtext = models.CharField(
        max_length=255,
        default="Contact our engineering team for a free consultation and project estimate.",
        help_text="Subtext for bottom CTA banner."
    )
    cta_button_label = models.CharField(
        max_length=50,
        default="Get In Touch",
        help_text="CTA button label."
    )
    cta_button_link = models.CharField(
        max_length=255,
        default="/contact-us",
        help_text="CTA button link destination."
    )

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return f"{self.company_name} Settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_solo(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class HeroSlide(TimeStampedModel):
    """
    CMS model for homepage hero carousel slides.
    Allows administrators to configure background images, headings, badges, and CTAs.
    """
    title = models.CharField(
        max_length=255,
        help_text="Internal slide reference title (e.g. 'Turnkey Machinery Slide')."
    )
    badge = models.CharField(
        max_length=100,
        blank=True,
        help_text="Optional small pill badge above heading."
    )
    heading = models.CharField(
        max_length=255,
        help_text="Main headline for this slide."
    )
    subtext = models.TextField(
        blank=True,
        help_text="Descriptive paragraph text."
    )
    image = models.ImageField(
        upload_to="site_settings/hero_slides/",
        help_text="Background hero machinery photo."
    )
    primary_cta_label = models.CharField(
        max_length=50,
        default="Explore Machinery",
        blank=True,
        help_text="Primary button text."
    )
    primary_cta_link = models.CharField(
        max_length=255,
        default="/products",
        blank=True,
        help_text="Primary button link destination."
    )
    secondary_cta_label = models.CharField(
        max_length=50,
        default="Request a Quote",
        blank=True,
        help_text="Secondary button text."
    )
    secondary_cta_link = models.CharField(
        max_length=255,
        default="/contact-us#quote",
        blank=True,
        help_text="Secondary button link destination."
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Slide display order."
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this slide is active on the homepage carousel."
    )

    class Meta:
        verbose_name = "Hero Slide"
        verbose_name_plural = "Hero Slides"
        ordering = ["order", "id"]

    def __str__(self):
        return f"Slide: {self.heading} (Order: {self.order})"

