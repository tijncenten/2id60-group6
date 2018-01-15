import React from 'react';
import { Avatar, Button, Card, CardTitle, CardText, TextField } from 'react-md';
import profilePictureParser from '../../../js/utils/profilePictureParser';

class PostCreate extends React.Component {

  render() {
    let avatar;
    if(activeUser.profilePicture === null){
      const initials = (activeUser.firstName[0] + activeUser.lastName[0]).toUpperCase();
      avatar = (
        <Avatar suffix={activeUser.avatarColor}>{initials}</Avatar>
      );
    } else {
      avatar = (
        <Avatar src={profilePictureParser.parseThumb(activeUser.profilePicture)}/>
      );
    }

    return (
      <Card className="md-block-centered post-create">
        <CardText>
          {avatar}
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
