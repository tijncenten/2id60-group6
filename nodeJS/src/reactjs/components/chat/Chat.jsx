import React from 'react';
import ChatMessage from './ChatMessage.jsx';
import MessageCreate from './MessageCreate.jsx';
import apiHandler from '../../../js/apiHandler';
import ws from '../../../js/ws';

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: null,
      chat: this.props.chat
    };

    this.update = this.update.bind(this);
    this.createMessage = this.createMessage.bind(this);
    this.incomingMessage = this.incomingMessage.bind(this);

    this.newMessage = false;
  }

  componentDidMount() {
    if(this.props.chat !== undefined) {
      this.update(this.props.chat.profile.id);
    }
    ws.addIncomingMessageListener(this.incomingMessage);
  }

  componentWillUnmount() {
    ws.removeIncomingMessageListener(this.incomingMessage);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.chat !== undefined && this.state.chat === undefined) {
      this.update(nextProps.chat.profile.id);
      this.setState({
        chat: nextProps.chat
      });
    }
  }

  componentDidUpdate() {
    if(this.newMessage) {
      setTimeout(() => {
        window.requestAnimationFrame(() => {
          let messageList = document.getElementById("chat-message-list");
          messageList.scrollTop = messageList.scrollHeight;
        });
      }, 0);
      this.newMessage = false;
    }
  }

  update(id) {
    apiHandler.getChatMessages(id).then(result => {
      this.setState({
        messages: result
      });
    })
  }

  createMessage(message) {
    if(message != "" && message != null) {
      ws.sendMessage(this.state.chat.profile.id, message);
    }
  }

  incomingMessage(message) {
    if(message.chat.id == this.props.chat.id) {
      this.setState({
        messages: this.state.messages.concat([message])
      });
      this.newMessage = true;
    }
  }

  render() {
    const { messages } = this.state;

    let content;
    if(messages === null) {
      content = (
        <span className="loading">
        </span>
      );
    } else {
      content = messages.map(message => (
        <ChatMessage key={message.id} message={message} />
      ));
    }

    let className = "chat";
    className += this.props.isDrawer ? " drawer" : "";
    className += this.props.visible ? "" : " hidden";
    return (
      <div className={className}>
        <div className="chat-message-list" id="chat-message-list">
          {content}
        </div>
        <MessageCreate createMessage={this.createMessage} />
      </div>
    );
  }
}

export default Chat;
