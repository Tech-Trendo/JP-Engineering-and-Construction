from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Category
from .serializers import CategorySerializer


class PublicCategoryListView(generics.ListAPIView):
    """
    Public read-only endpoint listing all active categories in display order.
    """
    permission_classes = [AllowAny]
    serializer_class = CategorySerializer
    pagination_class = None

    def get_queryset(self):
        return Category.objects.filter(is_active=True).order_by('order', 'name')
