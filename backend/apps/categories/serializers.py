from rest_framework import serializers
from .models import Category


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
