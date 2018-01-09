from rest_framework import permissions
from .models import Post

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return True

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if isinstance(obj, Post):
            if request.method == 'DELETE':
                if obj.placedOnProfile.user == request.user:
                    return True
            return obj.owner.user == request.user
        return False
