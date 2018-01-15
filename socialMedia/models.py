from channels import Channel
from django.db import models
from django.contrib.auth.models import User
from model_utils.managers import InheritanceManager
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from PIL import Image
import os, sys, io
from io import BytesIO
from django.core.files import File
from django.core.files.uploadedfile import InMemoryUploadedFile


# Create your models here.
def user_directory_path(instance, filename):
    return 'user_{0}/profile-picture/{1}'.format(instance.id, filename)

class Profile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE, related_name='profile')
    friends = models.ManyToManyField('self', through='Friendship', symmetrical=False, related_name='friends+')
    bio = models.CharField(max_length=254, default='')
    profilePicture = models.ImageField(upload_to=user_directory_path, blank=True)
    profilePictureNormal = models.ImageField(upload_to=user_directory_path, blank=True, editable=False)
    profilePictureSmall = models.ImageField(upload_to=user_directory_path, blank=True, editable=False)
    profilePictureThumb = models.ImageField(upload_to=user_directory_path, blank=True, editable=False)

    __original_profile_picture = None

    def __init__(self, *args, **kwargs):
        super(Profile, self).__init__(*args, **kwargs)
        self.__original_profile_picture = self.profilePicture.name

    def save(self, *args, **kwargs):
        if self.profilePicture and self.profilePicture.name != self.__original_profile_picture:
            #Large profile picture
            img = Image.open(self.profilePicture)
            if img.mode in ('RGBA', 'LA'):
                fill_color = (255, 255, 255)
                background = Image.new(img.mode[:-1], img.size, fill_color)
                background.paste(img, img.split()[-1])
                img = background
            output = BytesIO()
            img.thumbnail((800, 800), Image.ANTIALIAS)
            img.save(output, format='JPEG', quality=100)
            output.seek(0)
            self.profilePicture = InMemoryUploadedFile(output, 'profilePicture', "%s.jpg" % self.profilePicture.name.split('.')[0], 'image/jpeg', sys.getsizeof(output), None)

            width, height = img.size
            left = 0
            right = width
            top = 0
            bottom = height
            if width < height:
                top = (height - width)/2
                bottom = (height + width)/2
            if height < width:
                left = (width - height)/2
                right = (width + height)/2

            top = int(top)
            bottom = int(bottom)

            #Normal profile picture

            output = BytesIO()
            img = img.crop((left, top, right, bottom))
            img.thumbnail((200, 200), Image.ANTIALIAS)
            img.save(output, format='JPEG', quality=100)
            output.seek(0)
            self.profilePictureNormal = InMemoryUploadedFile(output, 'profilePictureNormal', "%s-normal.jpg" % self.profilePicture.name.split('.')[0], 'image/jpeg', sys.getsizeof(output), None)

            #Small profile picture
            output = BytesIO()
            img.thumbnail((100, 100), Image.ANTIALIAS)
            img.save(output, format='JPEG', quality=100)
            output.seek(0)
            self.profilePictureSmall = InMemoryUploadedFile(output, 'profilePictureSmall', "%s-small.jpg" % self.profilePicture.name.split('.')[0], 'image/jpeg', sys.getsizeof(output), None)

            #Thumb profile picture
            output = BytesIO()
            img.thumbnail((40, 40), Image.ANTIALIAS)
            img.save(output, format='JPEG', quality=100)
            output.seek(0)
            self.profilePictureThumb = InMemoryUploadedFile(output, 'profilePictureThumb', "%s-thumb.jpg" % self.profilePicture.name.split('.')[0], 'image/jpeg', sys.getsizeof(output), None)
        super(Profile, self).save(*args, **kwargs)
        self.__original_profile_picture = self.profilePicture.name

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

@receiver(post_save, sender=User)
def update_user_profile(sender, instance, created, **kwargs):
    if created and not instance.is_staff:
        Profile.objects.create(user=instance)
    if not instance.is_staff:
        instance.profile.save()

class FriendRequest(models.Model):
    sender = models.ForeignKey('Profile', on_delete=models.CASCADE, related_name='friendRequestsSent')
    receiver = models.ForeignKey('Profile', on_delete=models.CASCADE, related_name='friendRequestsReceived')
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('sender', 'receiver',)

    def __str__(self):
        return 'Friend request from ' + str(self.sender) + ' to ' + str(self.receiver)

@receiver(post_save, sender=FriendRequest)
def update_friend_request(sender, instance, created, **kwargs):
    if created:
        Channel('notifications').send({
            "to": instance.receiver.id,
            "type": "friendRequest",
            "id": instance.sender.id,
        })

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
    likes = models.PositiveIntegerField(editable=False, default=0)

    def add_like(self, profile):
        commentLike, created = CommentLike.objects.get_or_create(on=self, profile=profile)
        return created

    def remove_like(self, profile):
        deleted = CommentLike.objects.filter(on=self, profile=profile).delete()
        return deleted[0] > 0

    def __str__(self):
        return 'Comment on Post ' + str(self.post.id) + ': ' + self.content

@receiver(post_save, sender=CommentLike)
def create_comment_like(sender, instance, created, **kwargs):
    if created:
        instance.on.likes += 1
        instance.on.save()

@receiver(post_delete, sender=CommentLike)
def delete_comment_like(sender, instance, **kwargs):
    instance.on.likes -= 1
    instance.on.save()

class Post(models.Model):
    owner = models.ForeignKey('Profile', on_delete=models.CASCADE, related_name='profilePost')
    placedOnProfile = models.ForeignKey('Profile', on_delete=models.CASCADE, related_name='placedPost')
    date = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=100)
    content = models.TextField()
    likes = models.PositiveIntegerField(editable=False, default=0)

    objects = InheritanceManager()

    def add_like(self, profile):
        postLike, created = PostLike.objects.get_or_create(on=self, profile=profile)
        return created

    def remove_like(self, profile):
        deleted = PostLike.objects.filter(on=self, profile=profile).delete()
        return deleted[0] > 0

@receiver(post_save, sender=PostLike)
def create_post_like(sender, instance, created, **kwargs):
    if created:
        instance.on.likes += 1
        instance.on.save()

@receiver(post_delete, sender=PostLike)
def delete_post_like(sender, instance, **kwargs):
    instance.on.likes -= 1
    instance.on.save()

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
