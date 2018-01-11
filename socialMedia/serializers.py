from rest_framework import serializers
from .models import Profile, FriendRequest, Friendship, Post, SharedPost, NewPost
from django.contrib.auth.models import User

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    firstName = serializers.ReadOnlyField(source='user.first_name')
    lastName = serializers.ReadOnlyField(source='user.last_name')
    email = serializers.ReadOnlyField(source='user.email')
    relation = serializers.SerializerMethodField()

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

    class Meta:
        model = Profile
        fields = ('id', 'username', 'firstName', 'lastName', 'email', 'relation')

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
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    postType = serializers.SerializerMethodField()
    owner = serializers.ReadOnlyField(source='owner.id')
    placedOnProfile = serializers.ReadOnlyField(source='placedOnProfile.id')

    def get_postType(self, obj):
        return 'post'

    def to_representation(self, instance):
        if isinstance(instance, SharedPost):
            return SharedPostSerializer(instance=instance).data
        elif isinstance(instance, NewPost):
            return NewPostSerializer(instance=instance).data
        return super(PostSerializer, self).to_representation(instance)

    class Meta:
        model = Post
        fields = '__all__'

class NewPostSerializer(serializers.ModelSerializer):
    postType = serializers.SerializerMethodField()

    owner = serializers.ReadOnlyField(source='owner.id')
    placedOnProfile = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all())

    def get_postType(self, obj):
        return 'new'

    class Meta:
        model = NewPost
        fields = '__all__'

class SharedPostSerializer(serializers.ModelSerializer):
    postType = serializers.SerializerMethodField()

    owner = serializers.ReadOnlyField(source='owner.id')
    placedOnProfile = serializers.ReadOnlyField(source='placedOnProfile.id')
    sharedPost = NewPostSerializer(read_only=True)


    def get_postType(self, obj):
        return 'shared'

    class Meta:
        model = SharedPost
        fields = '__all__'
