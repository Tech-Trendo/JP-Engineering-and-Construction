from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from .models import QuoteRequest
from .serializers import PublicQuoteRequestCreateSerializer


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
