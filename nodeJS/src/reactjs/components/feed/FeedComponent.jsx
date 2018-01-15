import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Button, Card, CardTitle, CardText, CardActions } from 'react-md';
import { NavLink } from 'react-router-dom'
import CommentDialog from '../comments/CommentDialog.jsx';
import ShareDialog from './ShareDialog.jsx';
import DeleteDialog from './DeleteDialog.jsx';
import SharedFeedComponent from './SharedFeedComponent.jsx';
import apiHandler from '../../../js/apiHandler';
import profilePictureParser from '../../../js/utils/profilePictureParser';

class FeedComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      liked: this.props.data.liked,
      likes: this.props.data.likes,
      commentDialog: "unset",
    }

    this.handleLikeToggle = this.handleLikeToggle.bind(this);
    this.handleCommentOpen = this.handleCommentOpen.bind(this);
    this.handleShareOpen = this.handleShareOpen.bind(this);
    this.handleDeleteOpen = this.handleDeleteOpen.bind(this);
  }

  handleLikeToggle() {
    if (this.state.liked) {
      this.state.likes -= 1;
      apiHandler.postUnlike(this.props.data.id);
    } else {
      this.state.likes += 1;
      apiHandler.postLike(this.props.data.id);
    }

    this.setState({
      liked: !this.state.liked
    });
  }

  handleCommentOpen() {
    this.commentDialog.show();
  }

  handleShareOpen() {
    this.shareDialog.show();
  }

  handleDeleteOpen() {
    this.deleteDialog.show();
  }

  render() {
    const { liked, likes } = this.state;
    const { id, postType, owner, placedOnProfile, date, location, content } = this.props.data;
    const initials = (owner.firstName[0] + owner.lastName[0]).toUpperCase();
    let title = (
      <NavLink className="link-styling" to={`/profile/${owner.username}`}>
        {owner.firstName + " " + owner.lastName}
      </NavLink>
    )

    let sharedContent;
    if (postType === "shared"){
      const sharedPost = this.props.data.sharedPost;
      title = (
        <span>
          <NavLink className="link-styling" to={`/profile/${owner.username}`}>
            {owner.firstName + " " + owner.lastName + " "}
          </NavLink>
          shared a message of
          <NavLink className="link-styling" to={`/profile/${sharedPost.owner.username}`}>
            {" " + sharedPost.owner.firstName + " " + sharedPost.owner.lastName}
          </NavLink>
        </span>
      );
      sharedContent = (
        <SharedFeedComponent sharedPost={sharedPost}/>
      );
    }

    let avatar;
    if(owner.profilePicture === null){
      avatar = (
        <Avatar suffix={owner.avatarColor}>{initials}</Avatar>
      );
    } else {
      avatar = (
        <Avatar src={profilePictureParser.parseThumb(owner.profilePicture)}/>
      );
    }

    return (
      <Card className="md-block-centered feed-component">
        <CardTitle
          title={title}
          subtitle={date}
          avatar={<NavLink to={`/profile/${owner.username}`}>{avatar}</NavLink>}>
        </CardTitle>
        <CardText>
          {(content !== null || content !== "") && (
            <p>{content}</p>
          )}
        </CardText>
        {sharedContent}
        <CardActions>
          <Button icon secondary swapTheming={liked} onClick={this.handleLikeToggle}>thumb_up</Button>
          <div className="number-of-likes">
            {likes > 0 ? likes : ""}
          </div>
          <Button icon primary onClick={this.handleCommentOpen}>comment</Button>
          <Button icon primary onClick={this.handleShareOpen}>share</Button>
          {owner.id == activeUser.id && <Button icon primary onClick={this.handleDeleteOpen}>delete</Button> }
        </CardActions>
        <CommentDialog ref={ (dialog) => { this.commentDialog = dialog}} post={this.props.data}/>
        <ShareDialog ref={ (dialog) => { this.shareDialog = dialog}} sharePost={this.props.sharePost} data={this.props.data}/>
        {owner.id == activeUser.id && <DeleteDialog ref={ (dialog) => { this.deleteDialog = dialog}} deletePost={this.props.deletePost} id={this.props.data.id}/> }
      </Card>
    );
  }
}

FeedComponent.propTypes = {
  data: PropTypes.object.isRequired,
}

export default FeedComponent;


// <p>Etiam eget cursus ex, sed molestie augue. Mauris ultricies, tortor sit amet sagittis pellentesque, odio mi sollicitudin dolor, et suscipit nisl urna quis urna. Phasellus vulputate pretium magna, mollis laoreet dui porttitor ut. Nunc nec magna diam. Pellentesque at turpis sit amet nunc malesuada tristique. In sodales ipsum quis nisi aliquam, non viverra dui suscipit. Donec diam sem, laoreet vitae elementum et, fringilla in sapien. Morbi quam nibh, iaculis et iaculis ut, rhoncus id neque.</p>
//
// <p>Curabitur a molestie ligula. Donec auctor arcu vel mi bibendum ultrices. Cras faucibus vel magna nec laoreet. In cursus egestas lectus ac consectetur. Nam varius sodales mauris, et tincidunt ante viverra sed. Phasellus ac tempor mi. Phasellus feugiat nec eros nec tempus. Nullam eget consectetur ipsum. Etiam a odio ultrices, vulputate nunc ut, rhoncus ligula. Aenean tempor eleifend ligula quis imperdiet. Morbi ut semper lectus.</p>
