import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Button, Card, CardTitle, CardText, CardActions } from 'react-md';
import CommentDialog from '../comments/CommentDialog.jsx';
import ShareDialog from './ShareDialog.jsx';

class FeedComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      liked: props.liked,
      likes: props.likes,
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

    this.setState({
      liked: !this.state.liked
    });
  }

  render() {
    const { liked, likes } = this.state;
    const { date, message, user } = this.props;

    return (
      <Card className="md-block-centered feed-component">
        <CardTitle
          title={user.firstName + " " + user.lastName}
          subtitle={date.substring(0,10)}
          avatar={<Avatar random>{user.firstName.substring(0,1) + user.lastName.substring(0,1)}</Avatar>}>
        </CardTitle>
        <CardText>
          {(message !== null || message !== "") && (
            <p>{message}</p>
          )}
          {this.props.children !== null && (
            this.props.children
          )}
        </CardText>
        <CardActions>
          <Button icon secondary swapTheming={liked} onClick={this.handleLikeToggle}>thumb_up</Button>
          <div className="number-of-likes">
            {likes > 0 ? likes : ""}
          </div>
          <Button icon primary onClick={this.commentDialog === undefined ? () => {} : this.commentDialog.show}>comment</Button>
          <Button icon primary onClick={this.shareDialog === undefined ? () => {} : this.shareDialog.show}>share</Button>
        </CardActions>
        <CommentDialog ref={dialog => {this.commentDialog = dialog}}/>
        <ShareDialog ref={dialog => {this.shareDialog = dialog}}/>
      </Card>
    );
  }
}

FeedComponent.propTypes = {
  user: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  message: PropTypes.string,
  liked: PropTypes.bool.isRequired,
}

export default FeedComponent;


// <p>Etiam eget cursus ex, sed molestie augue. Mauris ultricies, tortor sit amet sagittis pellentesque, odio mi sollicitudin dolor, et suscipit nisl urna quis urna. Phasellus vulputate pretium magna, mollis laoreet dui porttitor ut. Nunc nec magna diam. Pellentesque at turpis sit amet nunc malesuada tristique. In sodales ipsum quis nisi aliquam, non viverra dui suscipit. Donec diam sem, laoreet vitae elementum et, fringilla in sapien. Morbi quam nibh, iaculis et iaculis ut, rhoncus id neque.</p>
//
// <p>Curabitur a molestie ligula. Donec auctor arcu vel mi bibendum ultrices. Cras faucibus vel magna nec laoreet. In cursus egestas lectus ac consectetur. Nam varius sodales mauris, et tincidunt ante viverra sed. Phasellus ac tempor mi. Phasellus feugiat nec eros nec tempus. Nullam eget consectetur ipsum. Etiam a odio ultrices, vulputate nunc ut, rhoncus ligula. Aenean tempor eleifend ligula quis imperdiet. Morbi ut semper lectus.</p>
