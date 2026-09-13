from django.db.models import Q
from rest_framework import generics, viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny
from apps.core.permissions import IsStaffUser
from .models import Product
from .serializers import (
    ProductListSerializer,
    ProductDetailSerializer,
    AdminProductSerializer,
)


class PublicProductListView(generics.ListAPIView):
    """
    Public read-only endpoint listing active products with filtering by category slug,
    search by query term, and pagination.
    """
    permission_classes = [AllowAny]
    serializer_class = ProductListSerializer

    def get_queryset(self):
        queryset = (
            Product.objects.filter(is_active=True)
            .prefetch_related('categories', 'images')
            .order_by('order', 'name')
        )

        category_params = self.request.query_params.getlist('category')
        if category_params:
            slugs = []
            for item in category_params:
                slugs.extend([s.strip() for s in item.split(',') if s.strip()])
            if slugs:
                queryset = queryset.filter(categories__slug__in=slugs)

        search_query = self.request.query_params.get('q')
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query)
                | Q(short_description__icontains=search_query)
                | Q(full_description__icontains=search_query)
            )

        return queryset.distinct()


class PublicProductDetailView(generics.RetrieveAPIView):
    """
    Public read-only endpoint retrieving a single product by its unique slug,
    including full description, all images, ordered specifications, categories, and related products.
    """
    permission_classes = [AllowAny]
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return (
            Product.objects.filter(is_active=True)
            .prefetch_related('categories', 'images', 'specifications')
        )


class AdminProductViewSet(viewsets.ModelViewSet):
    """
    Staff-only ModelViewSet for product management with nested create/update
    of images and specifications and multipart file support.
    """
    permission_classes = [IsStaffUser]
    serializer_class = AdminProductSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    queryset = (
        Product.objects.all()
        .prefetch_related('categories', 'images', 'specifications')
        .order_by('order', 'name')
    )
