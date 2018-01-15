import React from 'react';
import { Button, TextField } from 'react-md';

export default class MessageCreate extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    if(this.messageInput.value.trim() !== '') {
      this.props.createMessage(this.messageInput.value.trim());
    }
  }

  render() {
    return (
      <div className="message-create">
        <TextField
          id="message-input"
          rows={1}
          placeholder="Type a message"
          ref={message => {this.messageInput = message}}
          className="message-input" />
        <Button className="message-send" onClick={this.handleSubmit} icon primary>send</Button>
      </div>
    );
  }
}
