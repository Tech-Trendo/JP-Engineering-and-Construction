from django.urls import path
from .views import PublicCategoryListView

app_name = 'categories'

urlpatterns = [
    path('', PublicCategoryListView.as_view(), name='category_list'),
]
