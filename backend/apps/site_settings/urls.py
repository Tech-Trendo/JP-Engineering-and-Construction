from django.urls import path
from .views import PublicSiteSettingsView, PublicHeroSlideListView

urlpatterns = [
    path('', PublicSiteSettingsView.as_view(), name='public-site-settings'),
    path('hero-slides/', PublicHeroSlideListView.as_view(), name='public-hero-slides'),
]

