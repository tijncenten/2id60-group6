from channels.routing import route, include
from socialMedia.consumers import ws_connect, ws_message, ws_disconnect, msg_consumer_chat, msg_consumer_notification

ws_routing = [
    route('websocket.connect', ws_connect),
    route('websocket.receive', ws_message),
    route('websocket.disconnect', ws_disconnect),

]

channel_routing = [
    include(ws_routing, path=r'^/ws'),
    route('chat-messages', msg_consumer_chat),
    route('notifications', msg_consumer_notification)
]
