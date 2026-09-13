from django.urls import path
from .views import PublicTeamListView, PublicPartnerListView, PublicClientListView

app_name = 'showcase'

urlpatterns = [
    path('team/', PublicTeamListView.as_view(), name='team_list'),
    path('partners/', PublicPartnerListView.as_view(), name='partner_list'),
    path('clients/', PublicClientListView.as_view(), name='client_list'),
]
