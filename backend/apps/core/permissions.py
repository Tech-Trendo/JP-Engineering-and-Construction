from rest_framework.permissions import BasePermission


class IsStaffUser(BasePermission):
    """
    Permission class that grants access strictly to authenticated staff members.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
