from django.contrib import admin
from .models import Product, ProductImage, ProductSpecification


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'alt_text', 'order', 'is_primary')


class ProductSpecificationInline(admin.TabularInline):
    model = ProductSpecification
    extra = 1
    fields = ('label', 'value', 'order')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'is_featured', 'order', 'created_at')
    list_filter = ('is_active', 'is_featured', 'categories', 'created_at')
    search_fields = ('name', 'short_description', 'full_description')
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ('categories',)
    ordering = ('order', 'name')
    inlines = [ProductImageInline, ProductSpecificationInline]


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image', 'alt_text', 'order', 'is_primary')
    list_filter = ('is_primary', 'product')
    search_fields = ('product__name', 'alt_text')
    ordering = ('product', 'order')


@admin.register(ProductSpecification)
class ProductSpecificationAdmin(admin.ModelAdmin):
    list_display = ('product', 'label', 'value', 'order')
    list_filter = ('product',)
    search_fields = ('product__name', 'label', 'value')
    ordering = ('product', 'order')
