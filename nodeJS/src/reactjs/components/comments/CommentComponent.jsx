import React from 'react';
import { Paper, Avatar, Button, FontIcon } from 'react-md';
import { NavLink } from 'react-router-dom';

class CommentComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      liked: props.liked,
      likes: props.likes
    }

    this.handleLikeToggle = this.handleLikeToggle.bind(this);
  }

  handleLikeToggle() {

    if (this.state.liked) {
      // Substract a like
      this.state.likes -= 1;
      // TODO send to backend
    } else {
      // Add a like
      this.state.likes += 1;
      // TODO: send to backend
    }
    // Toggle icon
    this.setState({
      liked: !this.state.liked
    });
  }

  render() {
    return (
      <div>
        <NavLink to={`/profile/${this.props.username}`}>
          <Avatar random className="comment-avatar">{this.props.username.substring(0,2)}</Avatar>
        </NavLink>
        <div className="md-paper md-paper--1 chat-message comment-message">
          <div>
            <NavLink className="link-styling" to={`/profile/${this.props.username}`}>{this.props.username}</NavLink>
            {" " + this.props.message}
          </div>
          <div className="comment-info-wrapper d-flex">
            <div className="comment-date">
              {this.props.date}
            </div>
            <div className="inline-block">
              <Button icon secondary swapTheming={this.state.liked} onClick={this.handleLikeToggle}>thumb_up</Button>
              <div className="number-of-likes">
                {this.state.likes > 0 ? this.state.likes : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CommentComponent
