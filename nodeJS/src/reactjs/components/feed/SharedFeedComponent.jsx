import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Card, CardTitle, CardText } from 'react-md';
import { NavLink } from 'react-router-dom'

export default class SharedFeedComponent extends React.Component {
  render() {
    const sharedPost = this.props.sharedPost;
    const sharedInitials = (sharedPost.owner.firstName[0] + sharedPost.owner.lastName[0]).toUpperCase();
    return (
      <Card className="md-block-centered feed-component shared">
        <CardTitle
          title={<NavLink className="link-styling" to={`/profile/${sharedPost.owner.username}`}>{sharedPost.owner.firstName + " " + sharedPost.owner.lastName}</NavLink>}
          subtitle={sharedPost.date}
          avatar={<NavLink to={`/profile/${sharedPost.owner.username}`}><Avatar suffix={sharedPost.owner.avatarColor}>{sharedInitials}</Avatar></NavLink>}>
        </CardTitle>
        <CardText>
          {(sharedPost.content !== null || sharedPost.content !== "") && (
            <p>{sharedPost.content}</p>
          )}
        </CardText>
      </Card>
    );
  }
}

SharedFeedComponent.propTypes = {
  sharedPost: PropTypes.object.isRequired,
}