from django.db import models
from django.contrib.auth.models import User
from model_utils.managers import InheritanceManager

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE, related_name='profile')
    friends = models.ManyToManyField('self', through='Friendship', symmetrical=False, related_name='friends+')

    def __str__(self):
        return self.user.username

    def add_friend(self, friend, symm=True):
        friendship, created = Friendship.objects.get_or_create(profile=self, friend=friend)
        if symm:
            friend.add_friend(self, False)
        return friendship

    def remove_friend(self, friend, symm=True):
        Friendship.objects.filter(profile=self, friend=friend).delete()
        if symm:
            friend.remove_friend(self, False)

    def get_friends(self):
        return Friendship.objects.filter(profile=self)
        # return self.friends.filter(friendSet__profile=self)

class FriendRequest(models.Model):
    sender = models.ForeignKey('Profile', on_delete=models.CASCADE, related_name='friendRequestsSent')
    receiver = models.ForeignKey('Profile', on_delete=models.CASCADE, related_name='friendRequestsReceived')
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('sender', 'receiver',)

    def __str__(self):
        return 'Friend request from ' + str(self.sender) + ' to ' + str(self.receiver)

class Friendship(models.Model):
    profile = models.ForeignKey('Profile', on_delete=models.CASCADE, related_name='friendshipCreatorSet')
    friend = models.ForeignKey('Profile', on_delete=models.CASCADE, related_name='friendSet')
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('profile', 'friend',)

class Like(models.Model):
    profile = models.ForeignKey('Profile', on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True

class PostLike(Like):
    on = models.ForeignKey('Post', on_delete=models.CASCADE)

    class Meta:
        # Only one like per profile and post can be made
        unique_together = ('profile', 'on',)

    def __str__(self):
        return 'Like on Post ' + str(self.on.id)

class CommentLike(Like):
    on = models.ForeignKey('Comment', on_delete=models.CASCADE)

    class Meta:
        # Only one like per profile and post can be made
        unique_together = ('profile', 'on',)

    def __str__(self):
        return 'Like on Comment ' + str(self.on.id)

class Comment(models.Model):
    profile = models.ForeignKey('Profile', on_delete=models.CASCADE)
    post = models.ForeignKey('Post', on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    content = models.TextField()

    def __str__(self):
        return 'Comment on Post ' + str(self.post.id) + ': ' + self.content

class Post(models.Model):
    owner = models.ForeignKey('Profile', on_delete=models.CASCADE, related_name='profilePost')
    placedOnProfile = models.ForeignKey('Profile', on_delete=models.CASCADE, related_name='placedPost')
    date = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=100)
    content = models.TextField()

    objects = InheritanceManager()

class SharedPost(Post):
    sharedPost = models.ForeignKey('NewPost', on_delete=models.CASCADE)

    def __str__(self):
        return 'Shared Post ' + str(self.id)

class NewPost(Post):

    def __str__(self):
        return 'New Post ' + str(self.id)


class AlbumPost(NewPost):
    album = models.FileField(upload_to='uploads/%Y/%m/%d/')

class MapPost(NewPost):
    lat = models.DecimalField(max_digits=9, decimal_places=6)
    lon = models.DecimalField(max_digits=9, decimal_places=6)

class ChatMessage(models.Model):
    fromProfile = models.ForeignKey('Profile', on_delete=models.CASCADE, related_name='sentMessages')
    toProfile = models.ForeignKey('Profile', on_delete=models.CASCADE, related_name='receivedMessages')
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    message = models.TextField()
