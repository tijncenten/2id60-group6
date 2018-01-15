import React from 'react';
import { Paper } from 'react-md';

export default class ChatMessage extends React.Component {
  render() {
    const { message } = this.props;
    let className = "md-paper md-paper--1 chat-message";
    className += message.fromProfile === 'self' ? " chat-message--my-message" : "";
    return (
      <div className={className}>
        {message.message}
      </div>
    );
  }
}
