import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Card, Button } from 'react-md';
import { NavLink } from 'react-router-dom';
import apiHandler from '../../../js/apiHandler';

export default class FeedComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleAcceptButton = this.handleAcceptButton.bind(this);
    this.handleDeclineButton = this.handleDeclineButton.bind(this);
  }

  handleAcceptButton(){
    apiHandler.acceptFriendRequest(this.props.data.sender).then(this.props.update);
  }

  handleDeclineButton(){
    apiHandler.declineFriendRequest(this.props.data.sender).then(this.props.update);
  }

  render() {  
    const { data } = this.props;
    const initials = data.firstName[0] + data.lastName[0];

    return (
      <Card className="md-block-centered notification-feed-component">
        <NavLink to={`/profile/${data.username}`}><Avatar suffix={data.avatarColor} className="notification-avatar">{initials}</Avatar></NavLink>
        <div className="notification-text">
          <span>
            <NavLink className="link-styling" to={`/profile/${data.username}`}>
            {data.firstName}
            </NavLink>
            {" has sent you a friend request."}
          </span>
          <span>{data.date}</span>
        </div>
        <div className="friend-request-buttons">
          <Button raised primary onClick={this.handleDeclineButton}>Decline</Button>
          <Button raised secondary onClick={this.handleAcceptButton}>Accept</Button>
        </div>
      </Card>
    );
  }
}

FeedComponent.propTypes = {
  data: PropTypes.object.isRequired,
}

