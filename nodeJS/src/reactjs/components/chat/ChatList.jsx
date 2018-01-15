import React from 'react';
import { Avatar, List, ListItem } from 'react-md';

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
        {items.map(chat => (
          <ListItem
            key={chat.profile.id}
            leftAvatar={<Avatar random>{chat.profile.firstName[0] + chat.profile.lastName[0]}</Avatar>}
            primaryText={chat.profile.firstName + " " + chat.profile.lastName}
            secondaryText={chat.date}
            active={this.props.selectedId === chat.id}
            onClick={() => this.props.onItemClick(chat)} />
        ))}
      </List>
    );
  }
}

export default ChatList;
