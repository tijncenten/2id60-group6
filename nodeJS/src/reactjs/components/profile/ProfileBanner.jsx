import React from 'react';
import { Paper, Card, CardTitle, CardText, Avatar, CardActions, Button } from 'react-md';
import { NavLink } from 'react-router-dom'
import EditProfileDialog from './EditProfileDialog.jsx';
import apiHandler from '../../../js/apiHandler';
import profilePictureParser from '../../../js/utils/profilePictureParser';

export default class ProfileBanner extends React.Component {
  constructor(props){
    super(props);

    this.handleEditDialogOpen = this.handleEditDialogOpen.bind(this);
    this.handleFriendButton = this.handleFriendButton.bind(this);
  }

  handleEditDialogOpen() {
    this.editProfileDialog.show();
  }

  handleFriendButton() {
    if(this.props.profile.relation.type === "friends"){
      apiHandler.deleteFriend(this.props.profile.id).then(this.props.update);
      
    } else if (this.props.profile.relation.type === "request") {
      if(this.props.profile.relation.requestType === "sent"){
        // friendButtonText = "Pending" ;
        apiHandler.deleteFriendRequest(this.props.profile.id).then(this.props.update);
      } else if (this.props.profile.relation.requestType === "received"){
        // friendButtonText = "Accept friend request";
        apiHandler.acceptFriendRequest(this.props.profile.id).then(this.props.update);
      }
    } else {
      apiHandler.addFriend(this.props.profile.id).then(this.props.update);
    }
    // sent friend request to the database
  }

  render() {
    const { profile } = this.props;
    const fullname = `${profile.firstName} ${profile.lastName}`;
    let isDisabled = false;
    let friendButtonText;
    if(profile.relation.type === "friends"){
      friendButtonText = "Delete Friend";
    } else if (profile.relation.type === "request") {
      if(profile.relation.requestType === "sent"){
        friendButtonText = "Pending...";  
        isDisabled = true;
      } else if (profile.relation.requestType === "received"){
        friendButtonText = "Accept friend request";  
      }
    } else {
      friendButtonText = "Add Friend";  
    }

    let actions;
    if(profile.relation.type === "self") {
      actions = (
        <span>
          <Button raised secondary onClick={this.handleEditDialogOpen}>Edit Profile</Button>
        </span>
      )
    } else {
      actions = (
        <span>
          <Button raised secondary disabled={isDisabled} onClick={this.handleFriendButton}>{friendButtonText}</Button>
          <Button raised primary>Private message</Button>
        </span>
      )
    }
    let avatar;
    if(profile.profilePicture === null){
      avatar = (
        <Avatar suffix={profile.avatarColor} className="profile-banner-picture">{profile.firstName[0] + profile.lastName[0]}</Avatar>
      );
    } else {
      avatar = (
        <Avatar src={profilePictureParser.parseNormal(profile.profilePicture)} className="profile-banner-picture"/>
      );
    }

    return(
      <div className="md-paper md-paper--1 profile-banner">
        <div className="profile-banner-inner">
          {avatar}
          <div className="profile-banner-info">
            <NavLink to={`/profile/${profile.username}`}>
              <CardTitle title={fullname}/>
            </NavLink>
            <CardText >
              <p> -Hi, I'm a person that really likes pizza! cheers!</p>
            </CardText>
            <CardActions className="profile-banner-buttons">
              {actions}
            </CardActions>
          </div>
          <div className="profile-banner-friends">
            <Avatar src="/static/images/ER-Diagram-Database.png"/>
            <Avatar src="/static/images/ER-Diagram-Database.png"/>
            <Avatar src="/static/images/ER-Diagram-Database.png"/>
            <Avatar src="/static/images/ER-Diagram-Database.png"/>
            <CardActions className="profile-banner-friends-button">
              <NavLink to={`/profile/${profile.username}/friends`}>
                <Button raised primary>friends <span className="profile-banner-number-of-friends">{profile.friendCount}</span></Button>
              </NavLink>
            </CardActions>
            <EditProfileDialog ref={(dialog) => {this.editProfileDialog = dialog}}
              profile={profile} />
          </div>
        </div>
      </div>
    );
  }
}

// misschien wanneer mensen friends zijn
