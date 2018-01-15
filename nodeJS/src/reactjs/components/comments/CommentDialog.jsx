import React from 'react';
import { DialogContainer, Button } from 'react-md';
import CommentCreate from './CommentCreate.jsx'
import CommentComponent from './CommentComponent.jsx'
import apiHandler from '../../../js/apiHandler';

class CommentDialog extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      visible: false,
      comments: [
      ]
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.downloadComments = this.downloadComments.bind(this);
  }

  componentDidMount() {
    this.downloadComments(this.props.post.id);
  }

  show(){
    this.setState({ visible: true });
  }

  hide(){
    this.setState({ visible: false });
  }

  createComment(message) {

    if (message != "" && message != null){
      const createCommentCallback = (comment) => {
        this.setState({
          comments: this.state.comments.concat([comment])
        });
      };
      apiHandler.createComment(this.props.post.id, message).then(createCommentCallback);
    }
  }

  deleteComment(id) {
    var newComments = this.state.comments;
    newComments.splice(this.state.comments.findIndex(function(el){
      return el.id == id;
    }), 1);
    this.setState( {comments: newComments} );

    apiHandler.commentDelete(this.props.post.id, id);
  }

  downloadComments(id) {
    const commentCallback = (comments) => {
      this.setState({
        comments: comments
      });
    };

    apiHandler.getComments(id).then(commentCallback);
  }

  render() {
    const { visible } = this.state;

    return (
      <DialogContainer
        id="simple-list-dialog"
        visible={visible}
        title="Comments"
        onHide={this.hide}
        focusOnMount={false}
        dialogClassName="comment-dialog" >
        <Button icon onClick={this.hide} className="dialog-close-button">close</Button>
        {this.state.comments.map(comment => (
          <CommentComponent
            key={comment.id}
            postId={this.props.post.id}
            deleteComment={this.deleteComment.bind(this)}
            data={comment} />
        ))}
        <CommentCreate createComment = { this.createComment.bind(this) } />
      </DialogContainer>
    );
  }
}

export default CommentDialog;
