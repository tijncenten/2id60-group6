import React from 'react';
import { Paper, Card, CardTitle, CardText, Avatar, CardActions, Button } from 'react-md';
import { NavLink } from 'react-router-dom'

export default class ProfileBanner extends React.Component {
  render() {
    return(
      <div className="md-paper md-paper--1 profile-banner">
        <div className="profile-banner-inner">
          <Avatar src="/static/images/ER-Diagram-Database.png" className="profile-banner-picture"/>
          <div className="profile-banner-info">
            <NavLink to="/profile/julian"> 
              <CardTitle title="John Doe"/>
            </NavLink>
            <CardText >
              <p> -Hi, I'm a person that really likes pizza! cheers!</p>
            </CardText>
            <CardActions className="profile-banner-buttons">
              <Button raised secondary>Add friend</Button>
              <Button raised primary>Private message</Button>
            </CardActions>
          </div>
          <div className="profile-banner-friends">
            <Avatar src="/static/images/ER-Diagram-Database.png"/>
            <Avatar src="/static/images/ER-Diagram-Database.png"/>
            <Avatar src="/static/images/ER-Diagram-Database.png"/>
            <Avatar src="/static/images/ER-Diagram-Database.png"/>
            <CardActions className="profile-banner-friends-button">
              <NavLink to="/profile/julian/friends"> 
                <Button raised primary>friends <span className="profile-banner-number-of-friends">243</span></Button>
              </NavLink>
            </CardActions>
          </div>
        </div>
      </div>
    );
  }
}

// misschien wanneer mensen friends zijn