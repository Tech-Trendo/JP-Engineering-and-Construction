from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import AdminTokenObtainPairView, AdminLogoutView

app_name = 'accounts'

urlpatterns = [
    path('login/', AdminTokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('logout/', AdminLogoutView.as_view(), name='logout'),
]
