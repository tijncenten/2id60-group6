from django.contrib import admin
from .models import Profile, FriendRequest, Friendship, PostLike, CommentLike, Comment, SharedPost, NewPost, AlbumPost, MapPost, Chat, ChatMessage

# Register your models here.
admin.site.register(Profile)
admin.site.register(FriendRequest)
admin.site.register(Friendship)
admin.site.register(PostLike)
admin.site.register(CommentLike)
admin.site.register(Comment)
admin.site.register(SharedPost)
admin.site.register(NewPost)
admin.site.register(AlbumPost)
admin.site.register(MapPost)
admin.site.register(Chat)
admin.site.register(ChatMessage)
