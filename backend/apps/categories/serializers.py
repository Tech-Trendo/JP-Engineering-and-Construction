from __future__ import annotations

from django.db import models
from rest_framework import serializers
from .models import Category, Industry
from apps.products.models import Product


class CategorySerializer(serializers.ModelSerializer):
    """
    Public category serializer.
    """
    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'icon_or_image',
            'order',
        ]


class AdminCategorySerializer(serializers.ModelSerializer):
    """
    Staff-only category serializer with full CRUD attributes.
    """
    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'icon_or_image',
            'is_active',
            'order',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
        extra_kwargs = {
            'slug': {'required': False},
        }


class IndustrySerializer(serializers.ModelSerializer):
    """
    Public Industry sector list serializer.
    """
    icon_or_image_url = serializers.SerializerMethodField()
    categories_count = serializers.SerializerMethodField()
    products_count = serializers.SerializerMethodField()

    class Meta:
        model = Industry
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'icon_or_image',
            'icon_or_image_url',
            'categories_count',
            'products_count',
            'order',
        ]

    def get_icon_or_image_url(self, obj) -> str | None:
        if obj.icon_or_image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.icon_or_image.url)
            return obj.icon_or_image.url
        return None

    def get_categories_count(self, obj) -> int:
        return obj.categories.filter(is_active=True).count()

    def get_products_count(self, obj) -> int:
        cat_ids = obj.categories.values_list('id', flat=True)
        return Product.objects.filter(
            industries=obj,
            categories__id__in=cat_ids,
            is_active=True
        ).distinct().count()


class IndustryDetailSerializer(serializers.ModelSerializer):
    """
    Detailed Industry serializer returning linked categories and machinery products.
    """
    icon_or_image_url = serializers.SerializerMethodField()
    categories = CategorySerializer(many=True, read_only=True)
    products = serializers.SerializerMethodField()

    class Meta:
        model = Industry
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'icon_or_image',
            'icon_or_image_url',
            'categories',
            'products',
            'order',
        ]

    def get_icon_or_image_url(self, obj) -> str | None:
        if obj.icon_or_image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.icon_or_image.url)
            return obj.icon_or_image.url
        return None

    def get_products(self, obj):
        cat_ids = obj.categories.values_list('id', flat=True)
        products = Product.objects.filter(
            industries=obj,
            categories__id__in=cat_ids,
            is_active=True
        ).distinct().prefetch_related('categories', 'images').order_by('order', 'name')
        
        from apps.products.serializers import ProductListSerializer
        return ProductListSerializer(products, many=True, context=self.context).data


class AdminIndustrySerializer(serializers.ModelSerializer):
    """
    Admin CMS serializer for full CRUD on industries.
    """
    categories = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Category.objects.all(),
        required=False
    )
    categories_details = CategorySerializer(source='categories', many=True, read_only=True)
    products_count = serializers.SerializerMethodField()
    icon_or_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Industry
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'icon_or_image',
            'icon_or_image_url',
            'categories',
            'categories_details',
            'products_count',
            'is_active',
            'order',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at', 'icon_or_image_url', 'products_count']
        extra_kwargs = {
            'slug': {'required': False},
        }

    def get_icon_or_image_url(self, obj) -> str | None:
        if obj.icon_or_image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.icon_or_image.url)
            return obj.icon_or_image.url
        return None

    def get_products_count(self, obj) -> int:
        cat_ids = obj.categories.values_list('id', flat=True)
        return Product.objects.filter(
            models.Q(industries=obj) | models.Q(categories__id__in=cat_ids)
        ).distinct().count()

