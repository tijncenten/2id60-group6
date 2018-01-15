from django.shortcuts import render, get_object_or_404, redirect
from django.core import exceptions
from django.db.models import Q, Value
from django.db.models.functions import Concat
from django.http import Http404, HttpResponse
from django.views.generic import TemplateView
from django.contrib.auth import login, authenticate
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import APIException, AuthenticationFailed
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework.renderers import JSONRenderer
from rest_framework import status, generics, permissions, serializers
from .permissions import IsOwner, IsOwnerOrReadOnly, IsPostOwnerOrReadOnly, IsCommentOwnerOrReadOnly, IsMeOrReadOnly
from .models import Profile, FriendRequest, Friendship, Post, NewPost, SharedPost, PostLike, CommentLike, Comment
from .serializers import ProfileSerializer, ProfileDetailSerializer, FriendSerializer, FriendRequestSerializer, PostSerializer, NewPostSerializer, NewPostCreateSerializer, SharedPostSerializer, PostLikeSerializer, CommentLikeSerializer, CommentSerializer
from .forms import SignUpForm

# Create your views here.
class indexView(LoginRequiredMixin, TemplateView):
    template_name = 'socialMedia/index.html'
    login_url = '/login'

def index(request):
    if not request.user.is_authenticated():
        return redirect(to='/login')
    context = {}
    context['request'] = request
    activeUser = ProfileSerializer(request.user.profile, context=context).data
    activeUserJSON = JSONRenderer().render(activeUser)
    return render(request, 'socialMedia/index.html', {'activeUser': activeUserJSON})

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

    def get_queryset(self):
        queryset = Profile.objects.all()
        query = self.request.query_params.get('q', None)
        if query is not None:
            queryset = queryset.annotate(fullName=Concat('user__first_name', Value(' '), 'user__last_name'))
            queryset = queryset.filter(fullName__icontains=query)
        nr = self.request.query_params.get('nr', None)
        if nr is not None:
            try:
                queryset = queryset[:int(nr)]
            except:
                raise serializers.ValidationError({'nr': 'This parameter needs to be an integer'})
        return queryset

class ProfileDetail(generics.RetrieveUpdateAPIView):
    """
    Return details about a profile with id
    """
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsMeOrReadOnly)
    queryset = Profile.objects.all()
    serializer_class = ProfileDetailSerializer

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
        if pId == 'me':
            if not self.request.user.is_authenticated():
                raise AuthenticationFailed()
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
        if pId == 'me':
            if not self.request.user.is_authenticated():
                raise AuthenticationFailed()
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
            raise AuthenticationFailed()
        me = request.user.profile
        friend = Profile.objects.get(id=kwargs['fk'])
        me.remove_friend(friend)
        return Response(status=status.HTTP_204_NO_CONTENT)

class FriendRequestList(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated, IsOwner)
    serializer_class = FriendRequestSerializer

    def get_queryset(self):
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
        return FriendRequest.objects.filter(receiver=self.request.user.profile)

    def get_object(self):
        queryset = self.get_queryset()
        filter = {}
        filter['sender_id'] = self.kwargs[self.lookup_url_kwarg]
        obj = get_object_or_404(queryset, **filter)
        self.check_object_permissions(self.request, obj)
        return obj

class FriendRequestAccept(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated, IsOwner)
    serializer_class = FriendRequestSerializer
    lookup_url_kwarg = 'fk'

    def get(self, request, *args, **kwargs):
        try:
            friendRequest = FriendRequest.objects.get(sender__id=kwargs['fk'], receiver=request.user.profile)
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

# View for posts placed on a specific profile
class ProfilePostList(PostList):
    def get_queryset(self):
        pId = self.kwargs['pk']
        if pId == 'me':
            if self.request.user.is_authenticated():
                profile = self.request.user.profile
            else:
                raise exceptions.PermissionDenied
        else:
            try:
                profile = Profile.objects.get(id=pId)
            except:
                raise Http404()
        queryset = super(ProfilePostList, self).get_queryset()
        return queryset.filter(placedOnProfile=profile).order_by('-date')

# View for the feed on the 'home' page
class FeedList(PostList):
    def get_queryset(self):
        if not self.request.user.is_authenticated():
            raise exceptions.PermissionDenied
        profile = self.request.user.profile
        friends = profile.friends.all()
        queryset = super(FeedList, self).get_queryset()
        return queryset.filter(Q(placedOnProfile=profile) | Q(owner=profile) | Q(owner__in=friends)).order_by('-date')

class PostCreate(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = NewPost.objects.all()

    def get_serializer_class(self):
        if self.request and self.request.method == 'POST':
            return NewPostCreateSerializer
        return NewPostSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)

    def post(self, request, *args, **kwargs):
        context = {}
        context['request'] = request
        serializer = NewPostSerializer(data=request.data, context=context)
        if serializer.is_valid():
            profile = Profile.objects.get(id=request.data['placedOnProfile'])
            serializer.save(owner=request.user.profile, placedOnProfile=profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostDetail(PostSubClassFieldsMixin, generics.RetrieveDestroyAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsPostOwnerOrReadOnly)
    serializer_class = PostSerializer

# view for getting the posts that have been shared by someone
class PostShareList(generics.ListCreateAPIView):
    serializer_class = SharedPostSerializer

    def get_queryset(self):
        return SharedPost.objects.filter(sharedPost__owner=self.kwargs['pk'])

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

class PostLikeList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = PostLikeSerializer

    def get_queryset(self):
        post = Post.objects.get_subclass(id=self.kwargs['pk'])
        return PostLike.objects.filter(on=post)

    def post(self, request, pk, format=None):
        post = Post.objects.get_subclass(id=pk)
        if post.add_like(self.request.user.profile):
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_200_OK)

    def delete(self, request, pk, format=None):
        post = Post.objects.get_subclass(id=pk)
        if post.remove_like(self.request.user.profile):
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)

class CommentList(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = CommentSerializer

    def get_queryset(self):
        post = Post.objects.get_subclass(id=self.kwargs['pk'])
        return Comment.objects.filter(post=post)

    def perform_create(self, serializer):
        post = Post.objects.get_subclass(id=self.kwargs['pk'])
        profile = self.request.user.profile
        serializer.save(profile=profile, post=post)

class CommentDetail(generics.RetrieveDestroyAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsCommentOwnerOrReadOnly)
    serializer_class = CommentSerializer
    lookup_url_kwarg = 'ck'

    def get_queryset(self):
        post = Post.objects.get_subclass(id=self.kwargs['pk'])
        return Comment.objects.filter(post=post)

class CommentLikeList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = CommentLikeSerializer

    def get_queryset(self):
        post = Post.objects.get_subclass(id=self.kwargs['pk'])
        comment = Comment.objects.get(post=post, id=self.kwargs['ck'])
        return CommentLike.objects.filter(on=comment)

    def post(self, request, pk, ck, format=None):
        comment = Comment.objects.get(id=ck)
        if comment.add_like(self.request.user.profile):
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_200_OK)

    def delete(self, request, pk, ck, format=None):
        comment = Comment.objects.get(id=ck)
        if comment.remove_like(self.request.user.profile):
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)
