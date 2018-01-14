import React from 'react';
import { DialogContainer, Button, TextField } from 'react-md';

export default class EditProfileDialog extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      visible: false,
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  show(){
    this.setState({
      visible: true,
    });
  }

  hide(){
    this.setState({ visible: false });
  }

  render(){
    const { visible } = this.state;
    const actions = [{
      onClick: this.hide,
      primary: true,
      children: 'Discard changes',
    }, {
      onClick: this.hide,
      primary: true,
      children: 'Save changes',
    }];

    return (
      <DialogContainer
        id="edit-profile-dialog"
        visible={visible}
        title="Edit Profile"
        onHide={this.hide}
        focusOnMount={false}
        modal
        actions={actions}
        dialogClassName="edit-profile-dialog" >
        <h4>Edit your bio:</h4>
        <TextField
          id="post-input"
          rows={1}
          placeholder="Hi, this is my bio!"
          maxLength={254}/>
        <h4>Upload profile picture:</h4>
        <Button raised>Choose File</Button>
      </DialogContainer>
    );
  }
}