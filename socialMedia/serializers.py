from rest_framework import serializers
from .models import Profile, FriendRequest, Friendship, Post, SharedPost, NewPost, Like, PostLike, CommentLike, Comment
from django.contrib.auth.models import User

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    firstName = serializers.ReadOnlyField(source='user.first_name')
    lastName = serializers.ReadOnlyField(source='user.last_name')
    email = serializers.ReadOnlyField(source='user.email')
    profilePicture = serializers.ImageField(read_only=True)
    relation = serializers.SerializerMethodField()
    friendCount = serializers.SerializerMethodField()

    def get_relation(self, obj):
        if self.context['request'].user.is_authenticated():
            me = self.context['request'].user.profile
            if me == obj:
                result = {'type': 'self'}
                return result
            friendship = Friendship.objects.filter(profile=me, friend=obj).first()
            if friendship != None:
                result = {
                    'type': 'friends',
                    'since': friendship.date.isoformat()
                }
                return result
            friendRequest = FriendRequest.objects.filter(sender=me, receiver=obj).first()
            if friendRequest != None:
                result = {
                    'type': 'request',
                    'requestType': 'sent',
                    'since': friendRequest.date.isoformat()
                }
                return result
            friendRequest = FriendRequest.objects.filter(sender=obj, receiver=me).first()
            if friendRequest != None:
                result = {
                    'type': 'request',
                    'requestType': 'received',
                    'since': friendRequest.date.isoformat()
                }
                return result
        result = {'type': 'none'}
        return result

    def get_friendCount(self, obj):
        return obj.get_friends().count()

    class Meta:
        model = Profile
        fields = ('id', 'username', 'firstName', 'lastName', 'email', 'profilePicture', 'relation', 'friendCount')

class ProfileDetailSerializer(ProfileSerializer):
    profilePicture = serializers.ImageField(required=False)

    class Meta:
        model = Profile
        fields = ('id', 'username', 'firstName', 'lastName', 'email', 'bio', 'profilePicture', 'relation', 'friendCount')

class FriendSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(source='friend.id')
    username = serializers.ReadOnlyField(source='friend.user.username')
    firstName = serializers.ReadOnlyField(source='friend.user.first_name')
    lastName = serializers.ReadOnlyField(source='friend.user.last_name')
    email = serializers.ReadOnlyField(source='friend.user.email')
    friendSince = serializers.ReadOnlyField(source='date')

    class Meta:
        model = Friendship
        fields = ('id', 'username', 'firstName', 'lastName', 'email', 'friendSince')

class FriendRequestSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(read_only=True)
    receiver = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all())
    username = serializers.ReadOnlyField(source='sender.user.username')
    firstName = serializers.ReadOnlyField(source='sender.user.first_name')
    lastName = serializers.ReadOnlyField(source='sender.user.last_name')
    email = serializers.ReadOnlyField(source='sender.user.email')
    date = serializers.ReadOnlyField()

    class Meta:
        model = FriendRequest
        fields = ('sender', 'receiver', 'username', 'firstName', 'lastName', 'email', 'date')

class PostSerializer(serializers.ModelSerializer):
    postType = serializers.SerializerMethodField()
    # owner = serializers.ReadOnlyField(source='owner.id')
    # placedOnProfile = serializers.ReadOnlyField(source='placedOnProfile.id')
    owner = ProfileSerializer(read_only=True)
    placedOnProfile = ProfileSerializer(read_only=True)

    def get_postType(self, obj):
        return 'post'

    def to_representation(self, instance):
        if isinstance(instance, SharedPost):
            return SharedPostSerializer(instance=instance, context=self.context).data
        elif isinstance(instance, NewPost):
            return NewPostSerializer(instance=instance, context=self.context).data
        return super(PostSerializer, self).to_representation(instance)

    class Meta:
        model = Post
        fields = fields = ('id', 'postType', 'owner', 'placedOnProfile', 'date', 'location', 'content', 'likes', 'liked')

class PostLikedMixin(serializers.Serializer):
    liked = serializers.SerializerMethodField()

    def get_liked(self, obj):
        if self.context['request'].user.is_authenticated():
            return PostLike.objects.filter(on=obj, profile=self.context['request'].user.profile).exists()
        return False

class NewPostCreateSerializer(PostLikedMixin, serializers.ModelSerializer):
    postType = serializers.SerializerMethodField()

    owner = serializers.ReadOnlyField(source='owner.id')
    placedOnProfile = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all())

    def get_postType(self, obj):
        return 'new'

    class Meta:
        model = NewPost
        fields = fields = ('id', 'postType', 'owner', 'placedOnProfile', 'date', 'location', 'content', 'likes', 'liked')

# MIXIN
class PostSubClassProfilesMixin(serializers.Serializer):
    owner = serializers.SerializerMethodField()
    placedOnProfile = serializers.SerializerMethodField()

    def get_owner(self, obj):
        if self.context['request'].user.is_authenticated():
            if obj.owner == self.context['request'].user.profile:
                return 'self'
        return ProfileSerializer(obj.owner, read_only=True, context=self.context).data

    def get_placedOnProfile(self, obj):
        if obj.owner == obj.placedOnProfile:
            return 'owner'
        return ProfileSerializer(obj.placedOnProfile, read_only=True, context=self.context).data

class NewPostSerializer(NewPostCreateSerializer, PostSubClassProfilesMixin):
    pass

class SharedPostSerializer(PostLikedMixin, PostSubClassProfilesMixin, serializers.ModelSerializer):
    postType = serializers.SerializerMethodField()

    sharedPost = NewPostSerializer(read_only=True)

    def get_postType(self, obj):
        return 'shared'

    class Meta:
        model = SharedPost
        fields = ('id', 'postType', 'owner', 'placedOnProfile', 'date', 'location', 'content', 'likes', 'liked', 'sharedPost')

class CommentSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    date = serializers.ReadOnlyField()
    liked = serializers.SerializerMethodField()

    def get_profile(self, obj):
        return ProfileSerializer(obj.profile, read_only=True, context=self.context).data

    def get_liked(self, obj):
        if self.context['request'].user.is_authenticated():
            return CommentLike.objects.filter(on=obj, profile=self.context['request'].user.profile).exists()
        return False

    class Meta:
        model = Comment
        fields = ('id', 'profile', 'date', 'content', 'likes', 'liked')

class PostLikeSerializer(serializers.ModelSerializer):
    likeType = serializers.SerializerMethodField()
    profile = serializers.PrimaryKeyRelatedField(read_only=True)
    on = serializers.PrimaryKeyRelatedField(read_only=True)

    def get_likeType(self, obj):
        return 'postLike'

    class Meta:
        model = PostLike
        fields = '__all__'

class CommentLikeSerializer(serializers.ModelSerializer):
    likeType = serializers.SerializerMethodField()
    profile = serializers.PrimaryKeyRelatedField(read_only=True)
    on = serializers.PrimaryKeyRelatedField(read_only=True)

    def get_likeType(self, obj):
        return 'commentLike'

    class Meta:
        model = CommentLike
        fields = '__all__'
