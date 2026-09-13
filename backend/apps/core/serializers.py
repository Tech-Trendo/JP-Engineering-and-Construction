from rest_framework import serializers
from .models import SiteContent


class SiteContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteContent
        fields = ['id', 'title', 'short_intro', 'full_intro', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
