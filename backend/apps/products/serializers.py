import json
from django.db import transaction
from django.http import QueryDict
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


# ==========================================================
# Staff-only Admin Product Serializers (with Nested Create/Update)
# ==========================================================

class AdminProductSpecificationItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = ProductSpecification
        fields = ['id', 'label', 'value', 'order']


class AdminProductImageItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'order', 'is_primary']


class AdminProductSerializer(serializers.ModelSerializer):
    """
    Staff-only full CRUD serializer supporting nested create and update
    of specifications and images in a single payload.
    """
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        many=True,
        source='categories',
        required=False,
        write_only=True
    )
    categories = ProductCategorySnippetSerializer(many=True, read_only=True)
    specifications = AdminProductSpecificationItemSerializer(many=True, required=False)
    images = AdminProductImageItemSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'short_description',
            'full_description',
            'category_ids',
            'categories',
            'images',
            'specifications',
            'is_active',
            'is_featured',
            'order',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
        extra_kwargs = {
            'slug': {'required': False},
            'short_description': {'required': False, 'allow_blank': True},
        }

    def to_internal_value(self, data):
        # Convert QueryDict or dict into a standard Python dictionary so nested structures stay intact
        if isinstance(data, QueryDict):
            copied = {}
            for k in data.keys():
                v = data.getlist(k)
                copied[k] = v if len(v) > 1 else v[0]
        elif hasattr(data, 'copy'):
            copied = data.copy()
        else:
            copied = dict(data)

        # 1. Parse category_ids if stringified JSON
        if 'category_ids' in copied and isinstance(copied['category_ids'], str):
            try:
                copied['category_ids'] = json.loads(copied['category_ids'])
            except Exception:
                pass

        # 2. Parse specifications if stringified JSON
        if 'specifications' in copied and isinstance(copied['specifications'], str):
            try:
                copied['specifications'] = json.loads(copied['specifications'])
            except Exception:
                pass

        # 3. Parse images if stringified JSON or multipart fields like images[0]image
        image_indices = set()
        for key in list(copied.keys()):
            if key.startswith('images[') and ']' in key:
                idx_str = key[len('images['):key.find(']')]
                if idx_str.isdigit():
                    image_indices.add(int(idx_str))

        if image_indices:
            images_list = []
            for idx in sorted(image_indices):
                img_dict = {}
                if f'images[{idx}]id' in copied and copied[f'images[{idx}]id']:
                    try:
                        img_dict['id'] = int(copied[f'images[{idx}]id'])
                    except (ValueError, TypeError):
                        pass
                if f'images[{idx}]image' in copied:
                    val = copied[f'images[{idx}]image']
                    if not isinstance(val, str):
                        img_dict['image'] = val
                    else:
                        img_dict['image'] = None
                if f'images[{idx}]alt_text' in copied:
                    img_dict['alt_text'] = copied[f'images[{idx}]alt_text']
                if f'images[{idx}]order' in copied:
                    img_dict['order'] = copied[f'images[{idx}]order']
                if f'images[{idx}]is_primary' in copied:
                    is_p = copied[f'images[{idx}]is_primary']
                    img_dict['is_primary'] = str(is_p).lower() in ['true', '1']
                images_list.append(img_dict)
            copied['images'] = images_list
        elif 'images' in copied and isinstance(copied['images'], str):
            try:
                raw_images = json.loads(copied['images'])
                if isinstance(raw_images, list):
                    for item in raw_images:
                        if isinstance(item, dict) and isinstance(item.get('image'), str):
                            item['image'] = None
                copied['images'] = raw_images
            except Exception:
                pass

        return super().to_internal_value(copied)

    @transaction.atomic
    def create(self, validated_data):
        specifications_data = validated_data.pop('specifications', [])
        images_data = validated_data.pop('images', [])
        categories = validated_data.pop('categories', [])

        product = Product.objects.create(**validated_data)

        if categories:
            product.categories.set(categories)

        for spec in specifications_data:
            spec.pop('id', None)
            ProductSpecification.objects.create(product=product, **spec)

        for img in images_data:
            img.pop('id', None)
            if img.get('image'):
                ProductImage.objects.create(product=product, **img)

        # Process any multipart uploaded_images files
        request = self.context.get('request')
        if request and hasattr(request, 'FILES'):
            uploaded_files = request.FILES.getlist('uploaded_images')
            for idx, file_obj in enumerate(uploaded_files):
                ProductImage.objects.create(
                    product=product,
                    image=file_obj,
                    alt_text=file_obj.name,
                    order=len(images_data) + idx,
                    is_primary=(idx == 0 and not any(i.get('is_primary') for i in images_data))
                )

        return product

    @transaction.atomic
    def update(self, instance, validated_data):
        specifications_data = validated_data.pop('specifications', None)
        images_data = validated_data.pop('images', None)
        categories = validated_data.pop('categories', None)

        if categories is not None:
            instance.categories.set(categories)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if specifications_data is not None:
            instance.specifications.all().delete()
            for spec in specifications_data:
                spec.pop('id', None)
                ProductSpecification.objects.create(product=instance, **spec)

        if images_data is not None:
            kept_ids = [img['id'] for img in images_data if 'id' in img and img['id']]
            # Remove images that were removed by the admin
            instance.images.exclude(id__in=kept_ids).delete()
            for img in images_data:
                img_id = img.pop('id', None)
                if img_id:
                    existing_img = instance.images.filter(id=img_id).first()
                    if existing_img:
                        if img.get('image'):
                            existing_img.image = img['image']
                        if 'alt_text' in img:
                            existing_img.alt_text = img['alt_text']
                        if 'order' in img:
                            existing_img.order = img['order']
                        if 'is_primary' in img:
                            existing_img.is_primary = img['is_primary']
                        existing_img.save()
                        continue
                if img.get('image'):
                    ProductImage.objects.create(product=instance, **img)

        request = self.context.get('request')
        if request and hasattr(request, 'FILES'):
            uploaded_files = request.FILES.getlist('uploaded_images')
            for idx, file_obj in enumerate(uploaded_files):
                ProductImage.objects.create(
                    product=instance,
                    image=file_obj,
                    alt_text=file_obj.name,
                    order=idx
                )

        return instance
