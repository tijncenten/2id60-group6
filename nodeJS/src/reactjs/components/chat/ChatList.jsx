import React from 'react';
import { Avatar, List, ListItem } from 'react-md';
import profilePictureParser from '../../../js/utils/profilePictureParser';

class ChatList extends React.Component {
  render() {
    const { items } = this.props;
    if(items === null){
      return (
        <span className="loading">
        </span>
      );
    }
    return (
      <List className="chat-list">
        {items.map(chat => {
          let avatar;
          if(chat.profile.profilePicture === null){
            avatar = (
              <Avatar suffix={chat.profile.avatarColor}>{chat.profile.firstName[0] + chat.profile.lastName[0]}</Avatar>
            );
          } else {
            avatar = (
              <Avatar src={profilePictureParser.parseThumb(chat.profile.profilePicture)}/>
            );
          }
          return (
          <ListItem
            key={chat.profile.id}
            leftAvatar={avatar}
            primaryText={chat.profile.firstName + " " + chat.profile.lastName}
            secondaryText={chat.date}
            active={this.props.selectedId === chat.id}
            onClick={() => this.props.onItemClick(chat)} />
          );
        })}
      </List>
    );
  }
}

export default ChatList;
