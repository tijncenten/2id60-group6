export const ChatSocket = new class {
  constructor() {
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var url = ws_scheme + '://' + window.location.host + "/chat/";
    this._socket = new WebSocket(url);

    this._socket.onmessage = (e) => {
      console.log(JSON.parse(e.data));
    }
  }

  sendMessage(receiverId, message) {
    if (this._socket.readyState == WebSocket.OPEN) {
      this._socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket was not open");
    }
  }
}

// var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
// var to = window.prompt("Fill in receiver id", 1);
// var url = ws_scheme + '://' + window.location.host + "/chat/";
// console.log(url);
// var chat_socket = new WebSocket(url);
//
// chat_socket.onmessage = function(e) {
//   console.log(JSON.parse(e.data));
// }
//
// var m = "Javascript test message" + (Math.floor(Math.random() * 1000));
//
// var message = {
//   to: to,
//   message: m
// };
//
// chat_socket.onopen = function() {
//   chat_socket.send(JSON.stringify(message));
// }
//
// if (chat_socket.readyState == WebSocket.OPEN) chat_socket.onopen();
