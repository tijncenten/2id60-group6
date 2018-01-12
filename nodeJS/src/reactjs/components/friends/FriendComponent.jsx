import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Card, CardTitle, Button } from 'react-md';
import DeleteFriendDialog from './DeleteFriendDialog.jsx';

export default class FriendComponent extends React.Component {
  render() {
    const { profile, date, id } = this.props;

    return (
      <Card className="md-block-centered friend-list-component">
        <Avatar random className="friend-list-avatar">{profile.initials}</Avatar>
        <div className="friend-text">
          <span ><strong>{profile.fullname}</strong></span>
          <span>{date}</span>
        </div>
        <Button icon primary className="friend-list-delete-button" onClick={this.deleteFriendDialog === undefined ? () => {} : () => {this.deleteFriendDialog.show(profile.fullname) }}>delete</Button>
        <DeleteFriendDialog ref={dialog => {this.deleteFriendDialog = dialog}} deleteFriend = {this.props.deleteFriend} id = {id}/>
      </Card>
    );
  }
}

FriendComponent.propTypes = {
  profile: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
}
