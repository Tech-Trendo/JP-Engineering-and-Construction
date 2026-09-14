from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminSiteSettingsView, AdminHeroSlideViewSet

router = DefaultRouter()
router.register(r'hero-slides', AdminHeroSlideViewSet, basename='admin-hero-slides')

urlpatterns = [
    path('site-settings/', AdminSiteSettingsView.as_view(), name='admin-site-settings'),
    path('', include(router.urls)),
]

