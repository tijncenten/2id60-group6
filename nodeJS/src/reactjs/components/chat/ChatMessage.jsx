import React from 'react';
import { Paper } from 'react-md';

export default class ChatMessage extends React.Component {
  render() {
    let className = "md-paper md-paper--1 chat-message";
    className += this.props.myMessage ? " chat-message--my-message" : "";
    return (
      <div className={className}>
        {this.props.message.text}
      </div>
    );
  }
}
