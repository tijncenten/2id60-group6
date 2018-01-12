from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import TemplateView
from django.contrib.auth import login, authenticate
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework import status, generics, permissions, serializers
from .permissions import IsOwner, IsOwnerOrReadOnly, IsPostOwnerOrReadOnly
from .models import Profile, FriendRequest, Friendship, Post, NewPost, SharedPost
from .serializers import ProfileSerializer, FriendSerializer, FriendRequestSerializer, PostSerializer, NewPostSerializer, SharedPostSerializer
from .forms import SignUpForm

# Create your views here.
class indexView(LoginRequiredMixin, TemplateView):
    template_name = 'socialMedia/index.html'
    login_url = '/login'

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect(to='/')
    else:
        form = SignUpForm()
    return render(request, 'registration/signup.html', {'form': form})


# API views
class ProfileList(generics.ListAPIView):
    """
    Return a list of all profiles in the system
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

class ProfileDetail(generics.RetrieveAPIView):
    """
    Return details about a profile with id
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def get_object(self):
        if self.kwargs['pk'] == 'me':
            if self.request.user.is_authenticated():
                return Profile.objects.get(user=self.request.user)
        return super().get_object()

class ProfileDetailUsername(ProfileDetail):

    def get_object(self):
        return Profile.objects.get(user__username__iexact=self.kwargs['pk'].lower())


class FriendsList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)
    serializer_class = FriendSerializer

    def get_queryset(self):
        pId = self.kwargs['pk']
        if pId == 'me' and self.request.user.is_authenticated():
            pId = Profile.objects.get(user=self.request.user).id
        profile = Profile.objects.get(id=pId)
        friends = profile.get_friends()
        return friends

class FriendsDetail(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)
    serializer_class = FriendSerializer
    lookup_url_kwarg = 'fk'

    def get_queryset(self):
        pId = self.kwargs['pk']
        if pId == 'me' and self.request.user.is_authenticated():
            pId = Profile.objects.get(user=self.request.user).id
        profile = Profile.objects.get(id=pId)
        return profile.get_friends()

    def get_object(self):
        queryset = self.get_queryset()
        filter = {}
        filter['friend_id'] = self.kwargs[self.lookup_url_kwarg]
        obj = get_object_or_404(queryset, **filter)
        self.check_object_permissions(self.request, obj)
        return obj

    def delete(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        me = request.user.profile
        friend = Profile.objects.get(id=kwargs['fk'])
        me.remove_friend(friend)
        return Response(status=status.HTTP_204_NO_CONTENT)

class FriendRequestList(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated, IsOwner)
    serializer_class = FriendRequestSerializer

    def get_queryset(self):
        if not self.request.user.is_authenticated():
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return FriendRequest.objects.filter(receiver=self.request.user.profile)

    def perform_create(self, serializer):
        profile = self.request.user.profile
        friend = serializer.validated_data['receiver']
        if profile == friend:
            raise serializers.ValidationError({'detail': 'Unable to request friendship with yourself'})
        if Friendship.objects.filter(profile=profile, friend=friend).exists():
            raise serializers.ValidationError({'detail': 'Already friends'})
        try:
            serializer.save(sender=self.request.user.profile)
        except:
            raise serializers.ValidationError({'detail': 'Friend request already pending'})

class FriendRequestDetail(generics.RetrieveDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated, IsOwner)
    serializer_class = FriendRequestSerializer
    lookup_url_kwarg = 'fk'

    def get_queryset(self):
        if not self.request.user.is_authenticated():
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return FriendRequest.objects.filter(receiver=self.request.user.profile)

class FriendRequestAccept(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated, IsOwner)
    serializer_class = FriendRequestSerializer
    lookup_url_kwarg = 'fk'

    def get(self, request, *args, **kwargs):
        try:
            friendRequest = FriendRequest.objects.get(id=kwargs['fk'])
            friendRequest.delete()
            sender = friendRequest.sender
            receiver = friendRequest.receiver
            sender.add_friend(receiver)
            return Response(status=status.HTTP_202_ACCEPTED)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

class PostSubClassFieldsMixin(object):
    def get_queryset(self):
        return Post.objects.select_subclasses()

class PostList(PostSubClassFieldsMixin, generics.ListAPIView):
    serializer_class = PostSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)

class PostCreate(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = NewPost.objects.all()
    serializer_class = NewPostSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)

class PostDetail(PostSubClassFieldsMixin, generics.RetrieveDestroyAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsPostOwnerOrReadOnly)
    serializer_class = PostSerializer

class PostShare(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsPostOwnerOrReadOnly)
    serializer_class = SharedPostSerializer

    def get_queryset(self):
        return SharedPost.objects.filter(sharedPost=self.kwargs['pk'])

    def perform_create(self, serializer):
        sharedPost = Post.objects.get_subclass(id=self.kwargs['pk'])
        while not isinstance(sharedPost, NewPost):
            sharedPost = sharedPost.sharedPost
        serializer.save(owner=self.request.user.profile,
            placedOnProfile=self.request.user.profile,
            sharedPost=sharedPost)
