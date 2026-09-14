"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.debug import default_urlconf


urlpatterns = [
    path('', default_urlconf),
    path('admin/', admin.site.urls),
    path('api/v1/', include([
        path('auth/', include('apps.accounts.urls')),
        path('public/', include([
            path('categories/', include('apps.categories.urls')),
            path('industries/', include('apps.categories.industry_urls')),
            path('products/', include('apps.products.urls')),
            path('quotes/', include('apps.quotes.urls')),
            path('site-content/', include('apps.core.public_urls')),
            path('site-settings/', include('apps.site_settings.urls')),
            path('', include('apps.showcase.urls')),
        ])),
        path('admin/', include([
            path('', include('apps.core.admin_urls')),
            path('', include('apps.site_settings.admin_urls')),
        ])),
    ])),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

