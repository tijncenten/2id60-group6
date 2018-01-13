import React from 'react';
import { DialogContainer, Button } from 'react-md';
import CommentCreate from './CommentCreate.jsx'
import CommentComponent from './CommentComponent.jsx'

class CommentDialog extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      visible: false,
      comments: [
        { id: 0, username: 'Alan', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          date: '7-1-2018', likes: 3},
        { id: 1, username: 'Boris', message: 'The quick brown fox jumps over the lazy dog',
          date: '8-1-2018', likes: 17}
      ]
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  show(){
    this.setState({ visible: true });
  }

  hide(){
    this.setState({ visible: false });
  }

  createComment(message) {

    if (message != "" && message != null){
      var d = new Date();
      var date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();

      const newComment = { id: this.state.comments.length, username: "Anon", message, date, likes: 0 }
      this.setState({ comments: this.state.comments.concat([newComment])});

      // TODO: Send to backend
    }
  }

  loadComments(){
    return this.state.comments.map( comment =>
      <CommentComponent
        key = {comment.id}
        username = {comment.username}
        message = {comment.message}
        date = {comment.date}
        likes = {comment.likes}
        liked = {false} />
      // TODO determine whether the user has liked this comment
      );
  }

  render() {
    const { visible } = this.state;
    const comments = this.loadComments();

    return (
      <DialogContainer
        id="simple-list-dialog"
        visible={visible}
        title="Comment dialog"
        onHide={this.hide}
        focusOnMount={false}
        dialogClassName="comment-dialog" >
        <Button icon onClick={this.hide} className="dialog-close-button">close</Button>

        {comments}

        <CommentCreate createComment = { this.createComment.bind(this) } />
      </DialogContainer>
    );
  }
}

export default CommentDialog;
