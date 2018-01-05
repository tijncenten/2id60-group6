import React from 'react';
import { Button, TextField } from 'react-md';

export default class MessageCreate extends React.Component {
  render() {
    return (
      <div className="message-create">
        <TextField
          id="message-input"
          rows={1}
          placeholder="Type a message"
          className="message-input" />
        <Button className="message-send" icon primary>send</Button>
      </div>
    );
  }
}
