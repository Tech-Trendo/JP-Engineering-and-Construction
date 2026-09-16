from rest_framework import serializers
from .models import SiteContent, FAQ


class SiteContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteContent
        fields = ['id', 'title', 'short_intro', 'full_intro', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class FAQSerializer(serializers.ModelSerializer):
    """
    Public serializer for published FAQs.
    """
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'page', 'category', 'order']


class AdminFAQSerializer(serializers.ModelSerializer):
    """
    Serializer for admin CMS CRUD operations on FAQs.
    """
    class Meta:
        model = FAQ
        fields = [
            'id',
            'question',
            'answer',
            'page',
            'category',
            'order',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

