from rest_framework import serializers
from apps.categories.models import Category
from .models import Product, ProductImage, ProductSpecification


class ProductCategorySnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = [
            'id',
            'image',
            'alt_text',
            'order',
            'is_primary',
        ]


class ProductSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSpecification
        fields = [
            'id',
            'label',
            'value',
            'order',
        ]


class ProductListSerializer(serializers.ModelSerializer):
    categories = ProductCategorySnippetSerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'short_description',
            'categories',
            'primary_image',
            'is_featured',
            'order',
        ]

    def get_primary_image(self, obj):
        request = self.context.get('request')
        # Check for image with is_primary=True, otherwise first image
        images = list(obj.images.all())
        if not images:
            return None
        primary = next((img for img in images if img.is_primary), images[0])
        if primary and primary.image:
            return request.build_absolute_uri(primary.image.url) if request else primary.image.url
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    categories = ProductCategorySnippetSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    specifications = serializers.SerializerMethodField()
    related_products = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'short_description',
            'full_description',
            'categories',
            'images',
            'specifications',
            'related_products',
            'is_featured',
            'order',
            'created_at',
            'updated_at',
        ]

    def get_specifications(self, obj):
        specs = obj.specifications.all().order_by('order', 'id')
        return ProductSpecificationSerializer(specs, many=True).data

    def get_related_products(self, obj):
        category_ids = obj.categories.values_list('id', flat=True)
        if not category_ids:
            return []
        related = (
            Product.objects.filter(is_active=True, categories__id__in=category_ids)
            .exclude(id=obj.id)
            .distinct()
            .prefetch_related('categories', 'images')
            .order_by('order', 'name')[:4]
        )
        return ProductListSerializer(related, many=True, context=self.context).data
