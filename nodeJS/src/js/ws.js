export default new class {
  constructor() {
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var url = ws_scheme + '://' + window.location.host + "/ws/";
    this._socket = new WebSocket(url);

    this._socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(JSON.parse(e.data));
      if(data.type == 'chatMessage') {
        console.log("test");
        this.callIncomingMessageListeners(data.content);
      }
    }

    this._incomingMessageListeners = [];
  }

  sendMessage(receiverId, message) {
    if (this._socket.readyState == WebSocket.OPEN) {
      const data = {
        to: receiverId,
        message: message
      }
      this._socket.send(JSON.stringify(data));
    } else {
      console.error("WebSocket was not open");
    }
  }

  addIncomingMessageListener(listener) {
    this._incomingMessageListeners.push(listener);
  }

  removeIncomingMessageListener(listener) {
    const index = this._incomingMessageListeners.indexOf(listener);
    if(index < 0) {
      return;
    }
    this._incomingMessageListeners.splice(index, 1);
  }

  callIncomingMessageListeners(message) {
    this._incomingMessageListeners.forEach(listener => listener(message));
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
