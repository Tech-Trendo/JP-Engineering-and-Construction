from django.urls import path
from .views import PublicProductListView, PublicProductDetailView

app_name = 'products'

urlpatterns = [
    path('', PublicProductListView.as_view(), name='product_list'),
    path('<slug:slug>/', PublicProductDetailView.as_view(), name='product_detail'),
]
