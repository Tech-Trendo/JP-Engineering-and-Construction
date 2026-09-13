from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import TeamMember, Partner, Client
from .serializers import TeamMemberSerializer, PartnerSerializer, ClientSerializer


class PublicTeamListView(generics.ListAPIView):
    """
    Public read-only endpoint listing all active team members in display order.
    """
    permission_classes = [AllowAny]
    serializer_class = TeamMemberSerializer
    pagination_class = None

    def get_queryset(self):
        return TeamMember.objects.filter(is_active=True).order_by('order', 'name')


class PublicPartnerListView(generics.ListAPIView):
    """
    Public read-only endpoint listing all active partners in display order.
    """
    permission_classes = [AllowAny]
    serializer_class = PartnerSerializer
    pagination_class = None

    def get_queryset(self):
        return Partner.objects.filter(is_active=True).order_by('order', 'name')


class PublicClientListView(generics.ListAPIView):
    """
    Public read-only endpoint listing all active clients in display order.
    """
    permission_classes = [AllowAny]
    serializer_class = ClientSerializer
    pagination_class = None

    def get_queryset(self):
        return Client.objects.filter(is_active=True).order_by('order', 'name')
