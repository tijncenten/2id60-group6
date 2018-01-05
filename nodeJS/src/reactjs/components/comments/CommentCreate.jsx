import React from 'react';
import { Button, SVGIcon, TextField } from 'react-md';

class CommentCreate extends React.Component {
  render() {
    return (
      <div>
        <TextField
        id="comment-input"
        rows={1}
        placeholder="make a comment here"
        className="comment-input" />
        <Button className="comment-send" icon primary>send</Button>
      </div>
    );
  }
}

export default CommentCreate;