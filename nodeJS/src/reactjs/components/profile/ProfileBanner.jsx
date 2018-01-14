import React from 'react';
import { Paper, Card, CardTitle, CardText, Avatar, CardActions, Button } from 'react-md';
import { NavLink } from 'react-router-dom'

export default class ProfileBanner extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      profile: this.props.profile,
    }
  }
  render() {
    const { profile } = this.state;
    const fullname = `${profile.firstName} ${profile.lastName}`;
    const friendButtonText = (profile.relation.type === "friends")? "Delete Friend" : "Add Friend";
    let actions;
    if(profile.relation.type === "self") {
      actions = (
        <Button raised secondary>Edit Profile</Button>
      )
    } else {
      actions = (
        <span>
          <Button raised secondary>{friendButtonText}</Button>
          <Button raised primary>Private message</Button>
        </span>
      )
    }
    return(
      <div className="md-paper md-paper--1 profile-banner">
        <div className="profile-banner-inner">
          <Avatar src="/static/images/ER-Diagram-Database.png" className="profile-banner-picture"/>
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
          </div>
        </div>
      </div>
    );
  }
}

// misschien wanneer mensen friends zijn