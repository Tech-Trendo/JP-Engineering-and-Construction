from rest_framework import exceptions
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT serializer enforcing that only staff users (is_staff=True)
    can authenticate and receive tokens for the admin portal.
    """

    def validate(self, attrs):
        data = super().validate(attrs)

        if not self.user.is_staff:
            raise exceptions.AuthenticationFailed(
                'Access denied. Only staff members can access the administration portal.'
            )

        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'is_staff': self.user.is_staff,
        }
        return data
