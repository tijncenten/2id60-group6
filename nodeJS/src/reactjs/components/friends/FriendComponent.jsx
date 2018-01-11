import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Card, CardTitle, Button } from 'react-md';
import DeleteFriendDialog from './DeleteFriendDialog.jsx';

export default class FriendComponent extends React.Component {
  render() {  
    const { data } = this.props;
    return (
      <Card className="md-block-centered friend-list-component">
        <Avatar random className="friend-list-avatar">{data.profile.initials}</Avatar>
        <div className="friend-text">
          <span ><strong>{data.profile.fullname}</strong></span>
          <span>{data.date}</span>
        </div>
        <Button icon primary className="friend-list-delete-button" onClick={this.deleteFriendDialog === undefined ? () => {} : () => {this.deleteFriendDialog.show(data.profile.fullname) }}>delete</Button>      
        <DeleteFriendDialog ref={dialog => {this.deleteFriendDialog = dialog}}/>
      </Card>
    );
  }
}

FriendComponent.propTypes = {
  data: PropTypes.object.isRequired,
}

