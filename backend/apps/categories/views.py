from rest_framework import generics, viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny
from apps.core.permissions import IsStaffUser
from .models import Category
from .serializers import CategorySerializer, AdminCategorySerializer


class PublicCategoryListView(generics.ListAPIView):
    """
    Public read-only endpoint listing all active categories in display order.
    """
    permission_classes = [AllowAny]
    serializer_class = CategorySerializer
    pagination_class = None

    def get_queryset(self):
        return Category.objects.filter(is_active=True).order_by('order', 'name')


class AdminCategoryViewSet(viewsets.ModelViewSet):
    """
    Staff-only ModelViewSet for managing categories with multipart file uploads.
    """
    permission_classes = [IsStaffUser]
    serializer_class = AdminCategorySerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    queryset = Category.objects.all().order_by('order', 'name')
