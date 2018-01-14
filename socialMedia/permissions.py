from rest_framework import permissions
from .models import Profile, FriendRequest, Post
from . import views

class IsOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        pId = view.kwargs['pk']
        if pId == 'me':
            return True
        profile = Profile.objects.get(id=pId)
        return profile.user == request.user

    def has_object_permission(self, request, view, obj):
        if type(view) is views.FriendsDetail:
            return True
        if type(obj) is Profile:
            return obj.user == request.user
        if type(obj) is FriendRequest:
            return obj.sender.user == request.user or obj.receiver.user == request.user
        return False

class IsPostOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Post):
            if request.method == 'DELETE':
                if obj.placedOnProfile.user == request.user:
                    return True
            return obj.owner.user == request.user
        return False

class OrReadOnlyMixin(object):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return super().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return super().has_object_permission(request, view, obj)

class IsOwnerOrReadOnly(OrReadOnlyMixin, IsOwner):
    pass

class IsPostOwnerOrReadOnly(OrReadOnlyMixin, IsPostOwner):
    pass

class IsMe(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if obj == request.user.profile:
            return True
        return False

class IsMeOrReadOnly(IsMe):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return super().has_object_permission(request, view, obj)
