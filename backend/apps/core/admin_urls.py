from django.urls import path
from rest_framework.routers import DefaultRouter
from apps.categories.views import AdminCategoryViewSet, AdminIndustryViewSet
from apps.products.views import AdminProductViewSet
from apps.quotes.views import AdminQuoteViewSet
from apps.showcase.views import (
    AdminTeamMemberViewSet,
    AdminPartnerViewSet,
    AdminClientViewSet,
)
from .views import AdminSiteContentView

router = DefaultRouter()
router.register('categories', AdminCategoryViewSet, basename='admin-category')
router.register('industries', AdminIndustryViewSet, basename='admin-industry')
router.register('products', AdminProductViewSet, basename='admin-product')
router.register('quotes', AdminQuoteViewSet, basename='admin-quote')
router.register('team', AdminTeamMemberViewSet, basename='admin-team')
router.register('partners', AdminPartnerViewSet, basename='admin-partner')
router.register('clients', AdminClientViewSet, basename='admin-client')

urlpatterns = [
    path('site-content/', AdminSiteContentView.as_view(), name='admin-site-content'),
] + router.urls
