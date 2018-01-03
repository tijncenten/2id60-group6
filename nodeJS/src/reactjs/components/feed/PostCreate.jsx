import React from 'react';
import { Avatar, Button, Card, CardTitle, CardText, TextField } from 'react-md';

export default class PostCreate extends React.Component {

  render() {
    return (
      <Card className="md-block-centered post-create">
        <CardText>
          <Avatar className="post-avatar" random>AB</Avatar>
          <TextField
            id="post-input"
            rows={1}
            placeholder="Write something funny"
            className="post-input" />
          <Button className="post-send" icon primary>send</Button>
        </CardText>
      </Card>
    );
  }
}
