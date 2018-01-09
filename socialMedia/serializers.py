from rest_framework import serializers
from .models import Profile, Post, SharedPost, NewPost
from django.contrib.auth.models import User

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    firstName = serializers.ReadOnlyField(source='user.first_name')
    lastName = serializers.ReadOnlyField(source='user.last_name')
    email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Profile
        fields = ('id', 'username', 'firstName', 'lastName', 'email')

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
