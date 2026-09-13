from django.db import models
from django.utils.text import slugify
from apps.core.models import TimeStampedModel


class Product(TimeStampedModel):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    short_description = models.TextField(blank=True)
    full_description = models.TextField(help_text="Detailed description of the product or equipment")
    categories = models.ManyToManyField(
        'categories.Category',
        related_name='products',
        blank=True
    )
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='products/images/')
    alt_text = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_primary = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Product Image'
        verbose_name_plural = 'Product Images'
        ordering = ['order', 'id']

    def __str__(self):
        return f"Image for {self.product.name} (order: {self.order})"


class ProductSpecification(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='specifications'
    )
    label = models.CharField(max_length=255, help_text='Specification label, e.g. "Capacity"')
    value = models.CharField(max_length=255, help_text='Specification value, e.g. "500 bottles/hour"')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Product Specification'
        verbose_name_plural = 'Product Specifications'
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.label}: {self.value} ({self.product.name})"
