import React from 'react';
import { Paper, Avatar, Button, FontIcon } from 'react-md';
import { NavLink } from 'react-router-dom';
import apiHandler from '../../../js/apiHandler';
import profilePictureParser from '../../../js/utils/profilePictureParser';

class CommentComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      liked: props.data.liked,
      likes: props.data.likes
    }

    this.handleLikeToggle = this.handleLikeToggle.bind(this);
  }

  handleLikeToggle() {
    if (this.state.liked) {
      this.state.likes -= 1;
      apiHandler.commentUnlike(this.props.postId, this.props.data.id);
    } else {
      this.state.likes += 1;
      apiHandler.commentLike(this.props.postId, this.props.data.id);
    }

    this.setState({
      liked: !this.state.liked
    });
  }

  render() {
    const { profile, content, date } = this.props.data;

    let title = (
      <NavLink className="link-styling" to={`/profile/${profile.username}`}>
        {profile.firstName + " " + profile.lastName}
      </NavLink>
    )

    let avatar;
    if(profile.profilePicture === null){
      const initials = (profile.firstName[0] + profile.lastName[0]).toUpperCase();
      avatar = (
        <Avatar className="comment-avatar" suffix={profile.avatarColor}>{initials}</Avatar>
      );
    } else {
      avatar = (
        <Avatar className="comment-avatar" src={profilePictureParser.parseThumb(profile.profilePicture)}/>
      );
    }

    return (
      <div>
        <NavLink to={`/profile/${profile.username}`}>
          {avatar}
        </NavLink>
        <div className="md-paper md-paper--1 chat-message comment-message">
          <div>
            {title}
            {" " + content}
          </div>
          <div className="comment-info-wrapper d-flex">
            <div className="comment-date">
              {date}
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
