# In consumers.py
import json
from channels import Channel, Group
from channels.sessions import channel_session
from channels.auth import channel_session_user, channel_session_user_from_http
from channels.security.websockets import allowed_hosts_only
from urllib.parse import parse_qs

# Connected to websocket.connect
@allowed_hosts_only
@channel_session_user_from_http
def ws_connect(message, room_name):
    print(message.user.username)
    # Accept connection
    message.reply_channel.send({"accept": True})
    # Parse the query string
    params = parse_qs(message.content["query_string"])
    if b"username" in params:
        # Set the username in the session
        #message.channel_session["username"] = params[b"username"][0].decode("utf8")
        message.channel_session["username"] = message.user.username
        # Add the user to the room_name group
        Group("chat-%s" % room_name).add(message.reply_channel)
    else:
        # Close the connection.
        message.reply_channel.send({"close": True})

# Connected to websocket.receive
@channel_session_user
def ws_message(message, room_name):
    Group("chat-%s" % room_name).send({
        "text": json.dumps({
            "text": message["text"],
            "username": message.channel_session["username"],
        }),
    })

# Connected to websocket.disconnect
@channel_session_user
def ws_disconnect(message, room_name):
    Group("chat-%s" % room_name).discard(message.reply_channel)
