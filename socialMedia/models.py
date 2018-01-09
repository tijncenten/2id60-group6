from django.db import models
from django.contrib.auth.models import User
from model_utils.managers import InheritanceManager

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE, related_name='profile')

    def __str__(self):
        return self.user.username

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
