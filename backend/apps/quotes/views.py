from rest_framework import generics, mixins, status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from apps.core.permissions import IsStaffUser
from .models import QuoteRequest
from .serializers import (
    PublicQuoteRequestCreateSerializer,
    AdminQuoteSerializer,
)


class QuoteAnonThrottle(AnonRateThrottle):
    scope = 'quotes'


class PublicQuoteCreateView(generics.CreateAPIView):
    """
    Public endpoint for prospective clients to submit quote requests.
    Throttled to prevent automated spam.
    """
    permission_classes = [AllowAny]
    serializer_class = PublicQuoteRequestCreateSerializer
    throttle_classes = [QuoteAnonThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "success": True,
                "message": "Thank you for reaching out. Your quote request has been received and our team will contact you shortly."
            },
            status=status.HTTP_201_CREATED
        )


class AdminQuoteViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):
    """
    Staff-only ViewSet for listing, filtering by status, retrieving, and updating quote statuses.
    """
    permission_classes = [IsStaffUser]
    serializer_class = AdminQuoteSerializer

    def get_queryset(self):
        queryset = QuoteRequest.objects.all().select_related('product').order_by('-created_at')
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset
