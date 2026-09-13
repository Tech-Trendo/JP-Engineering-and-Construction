from django.urls import path
from .views import PublicQuoteCreateView

app_name = 'quotes'

urlpatterns = [
    path('', PublicQuoteCreateView.as_view(), name='quote_create'),
]
