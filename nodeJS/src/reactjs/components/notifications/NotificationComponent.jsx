import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Card, Button } from 'react-md';

export default class FeedComponent extends React.Component {
  render() {  
    const { data } = this.props;
    let notificationText;
    if (data.notificationType == "friendRequest") {
      notificationText = " has sent you a friend request.";
    } else if (data.notificationType == "postShared") {
      notificationText = " has shared your post.";
    }
    const hasButtons = data.notificationType == "friendRequest"
    return (
      <Card className="md-block-centered notification-feed-component">
        <Avatar random className="notification-avatar">{data.profile.initials}</Avatar>
        <div className="notification-text">
          <span ><strong>{data.profile.name}</strong>{notificationText}</span>
          <span>{data.date}</span>
        </div>
        {hasButtons && (
        <div className="friend-request-buttons">
          <Button raised primary>Ignore</Button>
          <Button raised secondary>Accept</Button>
        </div>
        )}
      </Card>
    );
  }
}

FeedComponent.propTypes = {
  data: PropTypes.object.isRequired,
}

