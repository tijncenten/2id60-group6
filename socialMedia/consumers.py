# In consumers.py
import json
from channels import Channel, Group
from channels.sessions import channel_session
from channels.auth import channel_session_user, channel_session_user_from_http
from channels.security.websockets import allowed_hosts_only
from urllib.parse import parse_qs
from .models import ChatMessage, Profile, FriendRequest
from .serializers import FriendRequestSerializer

def msg_consumer_chat(message):
    from_id = int(message.content['from'])
    to_id = int(message.content['to'])
    fromProfile = Profile.objects.get(id=from_id)
    toProfile = Profile.objects.get(id=to_id)

    m = ChatMessage.objects.create(
        fromProfile=fromProfile,
        toProfile=toProfile,
        message=message.content['message'],
    )
    m.save()

    Group('chat-%i' % to_id).send({
        "text": json.dumps({
            "id": m.id,
            "from": from_id,
            "to": to_id,
            "timestamp": m.timestamp.isoformat(),
            "message": message.content['message'],
        }),
    })

def msg_consumer_notification(message):
    to_id = int(message.content['to'])
    toProfile = Profile.objects.get(id=to_id)

    if message.content['type'] == 'friendRequest':
        requestId = message.content['id']
        request = FriendRequest.objects.get(sender__id=requestId, receiver__id=to_id)
        data = FriendRequestSerializer(request).data
        data['date'] = data['date'].isoformat()

    Group('notification-%i' % to_id).send({
        "text": json.dumps({
            "type": message.content['type'],
            "content": data
        })
    })



# Connected to websocket.connect
@allowed_hosts_only
@channel_session_user_from_http
def ws_connect(message):
    # Accept connection
    message.reply_channel.send({"accept": True})
    if message.user.is_authenticated():
        # Set the username in the session
        message.channel_session["username"] = message.user.username

        from_id = message.user.profile.id

        # Add the user to the groups
        Group("chat-%i" % from_id).add(message.reply_channel)
        Group("notification-%i" % from_id).add(message.reply_channel)

        count = FriendRequest.objects.filter(receiver__id=from_id).count()

        Group('notification-%i' % from_id).send({
            "text": json.dumps({
                "type": "notificationCount",
                "count": count
            })
        })
    else:
        # Close the connection.
        message.reply_channel.send({"close": True})

# Connected to websocket.receive
@channel_session_user
def ws_message(message):
    data = json.loads(message['text'])
    Channel('chat-messages').send({
        "from": message.user.profile.id,
        "to": data['to'],
        "message": data['message'],
    })

# Connected to websocket.disconnect
@channel_session_user
def ws_disconnect(message):
    if message.user.is_authenticated():
        from_id = message.user.profile.id
        Group("chat-%i" % from_id).discard(message.reply_channel)
        Group("notification-%i" % from_id).discard(message.reply_channel)
