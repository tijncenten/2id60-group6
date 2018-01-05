var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
var url = ws_scheme + '://' + window.location.host + "/my_custom_chatroom/?username=" + Math.floor(Math.random() * 1000);
console.log(url);
var chat_socket = new WebSocket(url);

chat_socket.onmessage = function(e) {
  console.log(JSON.parse(e.data));
}

var m = "Javascript test message" + (Math.floor(Math.random() * 1000));

var message = {
  fromProfile: 1,
  toProfile: 2,
  message: m
};

chat_socket.onopen = function() {
  chat_socket.send(JSON.stringify(message));
}

if (chat_socket.readyState == WebSocket.OPEN) chat_socket.onopen();
