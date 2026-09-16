from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SiteContent, FAQ
from .serializers import SiteContentSerializer, FAQSerializer, AdminFAQSerializer
from .permissions import IsStaffUser


class PublicSiteContentView(APIView):
    """
    Public endpoint to retrieve the corporate introduction and overview text.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        content = SiteContent.get_solo()
        serializer = SiteContentSerializer(content)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminSiteContentView(APIView):
    """
    Authenticated staff-only endpoint to view and update site-wide introduction copy.
    """
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        content = SiteContent.get_solo()
        serializer = SiteContentSerializer(content)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        content = SiteContent.get_solo()
        serializer = SiteContentSerializer(content, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        content = SiteContent.get_solo()
        serializer = SiteContentSerializer(content, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PublicFAQListView(generics.ListAPIView):
    """
    Public endpoint to retrieve published FAQs.
    Supports ?page=<page_key> (e.g. 'products', 'industries', 'contact', etc.).
    If page is specified, returns items matching page or 'all'.
    """
    permission_classes = [AllowAny]
    serializer_class = FAQSerializer
    pagination_class = None

    def get_queryset(self):
        qs = FAQ.objects.filter(is_active=True)
        page = self.request.query_params.get('page')
        if page:
            qs = qs.filter(page__in=[page, 'all'])
        return qs.order_by('order', 'id')


class AdminFAQViewSet(viewsets.ModelViewSet):
    """
    Staff-only ModelViewSet for managing FAQs via the CMS dashboard.
    Supports filtering by ?page=..., ordering, creation, update, and deletion.
    """
    permission_classes = [IsStaffUser]
    serializer_class = AdminFAQSerializer
    pagination_class = None

    def get_queryset(self):
        qs = FAQ.objects.all()
        page = self.request.query_params.get('page')
        if page:
            qs = qs.filter(page=page)
        return qs.order_by('order', 'id')

