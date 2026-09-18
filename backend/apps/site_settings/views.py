from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SiteSettings, HeroSlide, DistrictCoverage
from .serializers import (
    SiteSettingsSerializer,
    HeroSlideSerializer,
    DistrictCoverageSerializer,
    CoverageSettingsSerializer,
)


class PublicSiteSettingsView(APIView):
    """
    Public read-only endpoint returning company details, contact info,
    hero copy, metrics/stats, and social links.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            settings_obj = SiteSettings.get_solo()
            serializer = SiteSettingsSerializer(settings_obj, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            fallback_data = {
                "id": 1,
                "company_name": "JP Engineering & Construction Pvt. Ltd.",
                "company_short_name": "JP Engineering & Construction Pvt. Ltd.",
                "logo": None,
                "logo_url": None,
                "tagline": "A trusted name in Nepal's engineering sector",
                "company_description": (
                    "A leading engineering company in Nepal specializing in cold storage, "
                    "water systems, dairy processing, steel fabrication, solar energy, and construction."
                ),
                "founding_year": "1998",
                "company_type": "Private Limited",
                "registration_number": "",
                "pan_vat_number": "",
                "employee_count": "150+",
                "primary_phone": "01-5385552",
                "secondary_phone": "9851112988, 9851158661, 9851158660",
                "primary_email": "info@jpec.com.np",
                "secondary_email": "",
                "address": "Kathmandu, Nepal",
                "business_hours": "Mon - Sat: 9:00 AM - 6:00 PM",
                "map_location_text": "Kathmandu, Nepal",
                "facebook_url": "https://facebook.com",
                "tiktok_url": "https://tiktok.com",
                "twitter_url": "",
                "linkedin_url": "",
                "youtube_url": "https://youtube.com",
                "hero_badge": "Engineering Excellence",
                "hero_heading": "JP Engineering & Construction Pvt. Ltd.",
                "hero_subtext": (
                    "A trusted name in Nepal's engineering sector — delivering integrated solutions in "
                    "cold storage, water treatment, dairy processing, steel fabrication, renewable "
                    "energy, and construction since 1998."
                ),
                "hero_image": None,
                "hero_image_url": None,
                "hero_cta_primary_label": "About Us",
                "hero_cta_primary_link": "/about/introduction",
                "hero_cta_secondary_label": "Contact Us",
                "hero_cta_secondary_link": "/contact-us",
                "stat_years_experience": "25+",
                "stat_projects_completed": "500+",
                "stat_happy_clients": "300+",
                "stat_business_sectors": "6",
                "cta_heading": "Ready to Start Your Project?",
                "cta_subtext": "Contact our engineering team for a free consultation and project estimate.",
                "cta_button_label": "Get In Touch",
                "cta_button_link": "/contact-us",
                "iso_certified": True,
                "iso_standard": "ISO 9001:2015",
                "iso_certificate_number": "129594/A/0001/UK/En",
                "iso_certificate_image": None,
                "iso_certificate_image_url": None,
                "iso_scope": (
                    "Manufacturing and Assembly of Reverse Osmosis Plant, Dairy Equipment's "
                    "(Pasteurizer, Homogenizer, Chilling Vat, Road Milk Tanker), Cold Storage Equipment's, "
                    "Solar Energy & Heat Pump System, Steel Fabrication"
                ),
                "iso_accreditation": "URS / UKAS Management Systems (0043) / IAF Multilateral Recognition Arrangement",
                "iso_issue_date": "18 November 2023",
                "iso_expiry_date": "17 November 2026",
            }
            return Response(fallback_data, status=status.HTTP_200_OK)


class AdminSiteSettingsView(APIView):
    """
    Authenticated staff-only endpoint to view and update site-wide settings.
    """
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        settings_obj = SiteSettings.get_solo()
        serializer = SiteSettingsSerializer(settings_obj, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        settings_obj = SiteSettings.get_solo()
        serializer = SiteSettingsSerializer(
            settings_obj,
            data=request.data,
            partial=False,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        settings_obj = SiteSettings.get_solo()
        serializer = SiteSettingsSerializer(
            settings_obj,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PublicHeroSlideListView(APIView):
    """
    Public endpoint returning active hero carousel slides ordered by 'order'.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        slides = HeroSlide.objects.filter(is_active=True).order_by('order', 'id')
        serializer = HeroSlideSerializer(slides, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


from rest_framework import viewsets

class AdminHeroSlideViewSet(viewsets.ModelViewSet):
    """
    Staff-only CRUD endpoint to manage homepage hero slides and their background images.
    """
    permission_classes = [IsAdminUser]
    serializer_class = HeroSlideSerializer
    queryset = HeroSlide.objects.all().order_by('order', 'id')


class PublicCoverageView(APIView):
    """
    Public read-only endpoint returning nationwide service coverage configuration,
    all active districts, and the list of currently highlighted districts.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        settings_obj = SiteSettings.get_solo()
        districts = DistrictCoverage.objects.filter(is_active=True).order_by('-is_highlighted', 'order', 'district_name')
        district_serializer = DistrictCoverageSerializer(districts, many=True, context={'request': request})
        highlighted_names = list(districts.filter(is_highlighted=True).values_list('district_name', flat=True))

        total_projects = sum(d.projects_count for d in districts.filter(is_highlighted=True))
        provinces_represented = len(set(districts.filter(is_highlighted=True).values_list('province', flat=True)))

        return Response({
            "is_active": settings_obj.coverage_is_active,
            "badge": settings_obj.coverage_badge,
            "heading": settings_obj.coverage_heading,
            "subtext": settings_obj.coverage_subtext,
            "stat_districts": settings_obj.coverage_stat_districts,
            "stat_projects": settings_obj.coverage_stat_projects,
            "stat_provinces": settings_obj.coverage_stat_provinces,
            "highlighted_districts": highlighted_names,
            "districts": district_serializer.data,
            "stats": {
                "highlighted_count": len(highlighted_names),
                "total_districts": districts.count(),
                "total_projects": total_projects,
                "provinces_count": provinces_represented,
            }
        }, status=status.HTTP_200_OK)


class AdminDistrictCoverageViewSet(viewsets.ModelViewSet):
    """
    Staff-only endpoint to view, create, edit, delete, and toggle district coverage highlights.
    """
    permission_classes = [IsAdminUser]
    serializer_class = DistrictCoverageSerializer
    queryset = DistrictCoverage.objects.all().order_by('-is_highlighted', 'order', 'district_name')
    pagination_class = None

    @action(detail=True, methods=['post'], url_path='toggle-highlight')
    def toggle_highlight(self, request, pk=None):
        district = self.get_object()
        explicit_val = request.data.get('is_highlighted', None)
        if explicit_val is not None:
            if isinstance(explicit_val, str):
                district.is_highlighted = explicit_val.strip().lower() in ('true', '1', 'yes')
            else:
                district.is_highlighted = bool(explicit_val)
        else:
            district.is_highlighted = not district.is_highlighted
        district.save()
        serializer = self.get_serializer(district)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='bulk-toggle')
    def bulk_toggle(self, request):
        """
        Allows toggling multiple districts at once, e.g. by list of IDs or by province.
        """
        district_ids = request.data.get('district_ids', [])
        province = request.data.get('province', None)
        raw_highlight = request.data.get('is_highlighted', True)
        if isinstance(raw_highlight, str):
            target_highlight = raw_highlight.strip().lower() in ('true', '1', 'yes')
        else:
            target_highlight = bool(raw_highlight)

        if district_ids:
            DistrictCoverage.objects.filter(id__in=district_ids).update(is_highlighted=target_highlight)
        elif province:
            DistrictCoverage.objects.filter(province=province).update(is_highlighted=target_highlight)
        else:
            return Response({"error": "Provide either district_ids or province."}, status=status.HTTP_400_BAD_REQUEST)

        districts = DistrictCoverage.objects.all().order_by('-is_highlighted', 'order', 'district_name')
        serializer = self.get_serializer(districts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminCoverageSettingsView(APIView):
    """
    Staff-only endpoint to view and update the homepage coverage map section copy & metrics.
    """
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        settings_obj = SiteSettings.get_solo()
        serializer = CoverageSettingsSerializer(settings_obj)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        settings_obj = SiteSettings.get_solo()
        serializer = CoverageSettingsSerializer(settings_obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        return self.put(request, *args, **kwargs)

