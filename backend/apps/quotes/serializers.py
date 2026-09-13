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
        name = attrs.get('name') or attrs.get('full_name')
        if not name:
            raise serializers.ValidationError({'name': 'Name is required.'})
        attrs['full_name'] = name
        attrs.pop('name', None)
        return attrs


class AdminQuoteSerializer(serializers.ModelSerializer):
    """
    Staff-only quote serializer allowing review and status update only.
    """
    product_name = serializers.CharField(
        source='product.name',
        read_only=True,
        default=None
    )

    class Meta:
        model = QuoteRequest
        fields = [
            'id',
            'full_name',
            'email',
            'phone',
            'company',
            'product',
            'product_name',
            'message',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'full_name',
            'email',
            'phone',
            'company',
            'product',
            'product_name',
            'message',
            'created_at',
            'updated_at',
        ]
