from rest_framework import generics, viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny
from apps.core.permissions import IsStaffUser
from .models import TeamMember, Partner, Client
from .serializers import (
    TeamMemberSerializer,
    PartnerSerializer,
    ClientSerializer,
    AdminTeamMemberSerializer,
    AdminPartnerSerializer,
    AdminClientSerializer,
)


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


# ==========================================================
# Staff-only Admin Showcase ViewSets
# ==========================================================

class AdminTeamMemberViewSet(viewsets.ModelViewSet):
    """
    Staff-only ModelViewSet for managing team members with photo uploads.
    """
    permission_classes = [IsStaffUser]
    serializer_class = AdminTeamMemberSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    queryset = TeamMember.objects.all().order_by('order', 'name')


class AdminPartnerViewSet(viewsets.ModelViewSet):
    """
    Staff-only ModelViewSet for managing partners with logo uploads.
    """
    permission_classes = [IsStaffUser]
    serializer_class = AdminPartnerSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    queryset = Partner.objects.all().order_by('order', 'name')


class AdminClientViewSet(viewsets.ModelViewSet):
    """
    Staff-only ModelViewSet for managing clients with logo uploads.
    """
    permission_classes = [IsStaffUser]
    serializer_class = AdminClientSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    queryset = Client.objects.all().order_by('order', 'name')
