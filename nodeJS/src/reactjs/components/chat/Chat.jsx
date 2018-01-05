import React from 'react';
import ChatMessage from './ChatMessage.jsx';
import MessageCreate from './MessageCreate.jsx';

const messages = [
  {
    id: 1,
    owner: 1,
    timestamp: "10:48",
    text: "This is some text for a message"
  }, {
    id: 2,
    owner: 2,
    timestamp: "10:48",
    text: "This is some text for a message"
  }, {
    id: 3,
    owner: 1,
    timestamp: "10:49",
    text: "This is some text for a message"
  }, {
    id: 4,
    owner: 2,
    timestamp: "10:55",
    text: "This is some text for a message"
  }, {
    id: 5,
    owner: 1,
    timestamp: "11:30",
    text: "This is some text for a message"
  }, {
    id: 6,
    owner: 1,
    timestamp: "11:30",
    text: "This is some other text for a message"
  }
  , {
    id: 7,
    owner: 2,
    timestamp: "11:32",
    text: "This is the start"
  }, {
    id: 8,
    owner: 2,
    timestamp: "11:32",
    text: "Of multiple messages"
  }, {
    id: 9,
    owner: 2,
    timestamp: "11:32",
    text: "Send after each other"
  }
];

class Chat extends React.Component {
  render() {
    let myid = 1;

    let className = "chat";
    className += this.props.isDrawer ? " drawer" : "";
    className += this.props.visible ? "" : " hidden";
    return (
      <div className={className}>
        <div className="chat-message-list">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} myMessage={message.owner === myid} />
          ))}
        </div>
        <MessageCreate />
      </div>
    );
  }
}

export default Chat;
