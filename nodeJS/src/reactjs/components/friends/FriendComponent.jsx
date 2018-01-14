import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Card, CardTitle, Button } from 'react-md';
import { NavLink } from 'react-router-dom';
import DeleteFriendDialog from './DeleteFriendDialog.jsx';

export default class FriendComponent extends React.Component {
  render() {
    const { profile, isMyself } = this.props;
    console.log(profile);
    const initials = profile.firstName[0] + profile.lastName[0];
    const fullName = `${profile.firstName} ${profile.lastName}`;
    
    return (
      <Card className="md-block-centered friend-list-component">
        <NavLink to={`/profile/${profile.username}`}><Avatar suffix={profile.avatarColor} className="friend-list-avatar">{initials}</Avatar></NavLink>
        <div className="friend-text">
          <NavLink className="link-styling" to={`/profile/${profile.username}`}>{fullName}</NavLink>
          <span>{profile.date}</span>
        </div>
        {isMyself && (
          <span>
            <Button icon primary className="friend-list-delete-button" onClick={this.deleteFriendDialog === undefined ? () => {} : () => {this.deleteFriendDialog.show(profile.fullName) }}>delete</Button>
            <DeleteFriendDialog ref={dialog => {this.deleteFriendDialog = dialog}} deleteFriend = {this.props.deleteFriend} id = {profile.id}/>
          </span>
        )}        
      </Card>
    );
  }
}

FriendComponent.propTypes = {
  profile: PropTypes.object.isRequired,
  isMyself: PropTypes.bool.isRequired,
}
