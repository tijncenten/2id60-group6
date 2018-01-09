from channels.routing import route, include
from socialMedia.consumers import ws_connect, ws_message, ws_disconnect, msg_consumer

chat_routing = [
    route('websocket.connect', ws_connect),
    route('websocket.receive', ws_message),
    route('websocket.disconnect', ws_disconnect),

]

channel_routing = [
    include(chat_routing, path=r'^/chat'),
    route('chat-messages', msg_consumer),
]
