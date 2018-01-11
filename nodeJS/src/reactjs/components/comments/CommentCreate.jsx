import React from 'react';
import { Button, SVGIcon, TextField } from 'react-md';

class CommentCreate extends React.Component {
  render() {
    return (
      <form className="comment-form" onSubmit={this.handleSubmit.bind(this)}>
        <TextField
        id="comment-input"
        rows={1}
        placeholder="make a comment here"
        className="comment-input"
        ref={(input) => this.message = input} />
        <Button className="comment-send" type="submit" icon primary>send</Button>
      </form>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.createComment(this.message.value);
  }
}

export default CommentCreate;
