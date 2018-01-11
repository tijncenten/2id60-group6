import React from 'react';
import { Avatar, Button, Card, CardTitle, CardText, TextField } from 'react-md';

class PostCreate extends React.Component {

  render() {
    return (
      <Card className="md-block-centered post-create">
        <CardText>
          <Avatar className="post-avatar" random>AB</Avatar>
          <form className="post-form" onSubmit={this.handleSubmit.bind(this)}>
            <TextField
              id="post-input"
              rows={1}
              placeholder="Write something funny"
              className="post-input"
              ref={(input) => this.message = input} />
            <Button className="post-send" type="submit" icon primary>send</Button>
          </form>
        </CardText>
      </Card>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.createPost(this.message.value);
  }
}

export default PostCreate
