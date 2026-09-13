from rest_framework import serializers
from apps.products.models import Product
from .models import QuoteRequest


class PublicQuoteRequestCreateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        write_only=True,
        required=False,
        max_length=255,
        help_text="Name of the requester"
    )
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(is_active=True),
        required=False,
        allow_null=True,
        default=None
    )

    class Meta:
        model = QuoteRequest
        fields = [
            'name',
            'full_name',
            'email',
            'phone',
            'company',
            'product',
            'message',
        ]
        extra_kwargs = {
            'full_name': {'required': False},
            'email': {'required': True},
            'phone': {'required': True},
            'message': {'required': True},
            'company': {'required': False, 'allow_blank': True},
        }

    def validate(self, attrs):
        # Support either name or full_name
        name = attrs.get('name') or attrs.get('full_name')
        if not name:
            raise serializers.ValidationError({'name': 'Name is required.'})
        attrs['full_name'] = name
        attrs.pop('name', None)
        return attrs
