import React from 'react';
import { Paper, Card, CardTitle, CardText, Avatar, CardActions, Button } from 'react-md';

export default class ProfileBanner extends React.Component {
  render() {
    return(
      <div className="md-paper md-paper--1 profile-banner">
        <div className="profile-banner-inner">
          <Avatar src="static/images/ER-Diagram-Database.png" className="profile-banner-picture"/>
          <div className="profile-banner-info">
            <CardTitle title="John Doe"/>
            <CardText >
              <p> -Hi, I'm a person that really likes pizza! cheers!</p>
            </CardText>
            <CardActions className="profile-banner-buttons">
              <Button raised secondary>Add friend</Button>
              <Button raised primary>Private message</Button>
            </CardActions>
          </div>
        </div>
      </div>
    );
  }
}

// misschien wanneer mensen friends zijn