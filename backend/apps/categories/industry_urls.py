from django.urls import path
from .views import PublicIndustryListView, PublicIndustryDetailView

app_name = 'industries'

urlpatterns = [
    path('', PublicIndustryListView.as_view(), name='industry-list'),
    path('<slug:slug>/', PublicIndustryDetailView.as_view(), name='industry-detail'),
]
