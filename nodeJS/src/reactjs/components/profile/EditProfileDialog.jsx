import React from 'react';
import { DialogContainer, Button, FileInput, TextField } from 'react-md';
import apiHandler from '../../../js/apiHandler';

export default class EditProfileDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      fileName: ''
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  show() {
    this.setState({
      visible: true,
    });
  }

  hide() {
    this.setState({ visible: false });
  }

  handleLoad(name, size) {
    this.setState({
      fileName: name
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    let bio = document.getElementById('profile-bio-input');
    let picture = document.getElementById('profile-picture-input');
    let pictureFile = picture.files[0];
    apiHandler.setProfileInformation(bio.value, pictureFile).then(this.hide);
  }

  render() {
    const { visible } = this.state;
    const { profile } = this.props;
    const actions = [{
      onClick: this.hide,
      primary: true,
      children: 'Discard changes',
    }];

    actions.push(<Button flat primary type="submit">Save changes</Button>);

    return (
      <form id="profile-information-form" onSubmit={this.handleSubmit}>
        <DialogContainer
          id="edit-profile-dialog"
          visible={visible}
          title="Edit Profile"
          onHide={this.hide}
          focusOnMount={false}
          modal
          actions={actions}
          dialogClassName="edit-profile-dialog">
          <h4>Edit your bio:</h4>
          <TextField
            id="profile-bio-input"
            rows={1}
            placeholder="Tell something about yourself"
            defaultValue={this.props.profile.bio}
            name="bio"
            maxLength={254}/>
          <h4>Upload profile picture:</h4>
          <FileInput id="profile-picture-input"
            onLoad={this.handleLoad}
            accept="image/*"
            name="profilePicture"
            primary />
          <TextField id="profile-picture-file"
            placeholder="No file chosen"
            value={this.state.fileName}
            readOnly
            fullWidth={false} />
        </DialogContainer>
      </form>
    );
  }
}
