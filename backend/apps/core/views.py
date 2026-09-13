from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SiteContent
from .serializers import SiteContentSerializer


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
