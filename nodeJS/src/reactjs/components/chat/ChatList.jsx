import React from 'react';
import { Avatar, List, ListItem } from 'react-md';

class ChatList extends React.Component {
  render() {
    return (
      <List className="chat-list">
        {this.props.items.map(chat => (
          <ListItem
            key={chat.id}
            leftAvatar={<Avatar random>{chat.name[0]}</Avatar>}
            primaryText={chat.name}
            secondaryText="This is some text for a chat message"
            active={this.props.selectedId === chat.id}
            onClick={() => this.props.onItemClick(chat)} />
        ))}
      </List>
    );
  }
}

export default ChatList;
