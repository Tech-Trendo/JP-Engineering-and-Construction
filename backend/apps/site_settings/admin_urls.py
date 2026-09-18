from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdminSiteSettingsView,
    AdminHeroSlideViewSet,
    AdminDistrictCoverageViewSet,
    AdminCoverageSettingsView,
)

router = DefaultRouter()
router.register(r'hero-slides', AdminHeroSlideViewSet, basename='admin-hero-slides')
router.register(r'coverage-districts', AdminDistrictCoverageViewSet, basename='admin-coverage-districts')

urlpatterns = [
    path('site-settings/', AdminSiteSettingsView.as_view(), name='admin-site-settings'),
    path('coverage-settings/', AdminCoverageSettingsView.as_view(), name='admin-coverage-settings'),
    path('', include(router.urls)),
]

