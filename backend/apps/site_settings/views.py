from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SiteSettings, HeroSlide
from .serializers import SiteSettingsSerializer, HeroSlideSerializer


class PublicSiteSettingsView(APIView):
    """
    Public read-only endpoint returning company details, contact info,
    hero copy, metrics/stats, and social links.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        settings_obj = SiteSettings.get_solo()
        serializer = SiteSettingsSerializer(settings_obj, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


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

