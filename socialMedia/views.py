from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework import status, generics, permissions, serializers
from .permissions import IsOwnerOrReadOnly
from .models import Profile, Post, NewPost, SharedPost
from .serializers import ProfileSerializer, PostSerializer, NewPostSerializer, SharedPostSerializer

# Create your views here.
class indexView(LoginRequiredMixin, TemplateView):
    template_name = 'socialMedia/index.html'
    login_url = '/login'



# API views
class ProfileList(generics.ListAPIView):
    """
    Return a list of all profiles in the system
    id: test
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


class PostSubClassFieldsMixin(object):
    def get_queryset(self):
        return Post.objects.select_subclasses()

class PostList(PostSubClassFieldsMixin, generics.ListAPIView):
    serializer_class = PostSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)

class PostCreate(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)
    queryset = NewPost.objects.all()
    serializer_class = NewPostSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)

class PostDetail(PostSubClassFieldsMixin, generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)
    serializer_class = PostSerializer

class PostShare(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)
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
