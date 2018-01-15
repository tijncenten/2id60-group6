import React from 'react';
import { DialogContainer, Button, FileInput, TextField, Portal } from 'react-md';
import apiHandler from '../../../js/apiHandler';

export default class EditProfileDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      fileName: '',
      loading: false,
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

  handleLoad(files, e) {
    this.setState({
      fileName: files.name
    });
  }

  handleSubmit(e) {
    this.setState({
      loading: true
    });
    e.preventDefault();

    let bio = document.getElementById('profile-bio-input');
    let picture = document.getElementById('profile-picture-input');
    let pictureFile = picture.files[0];

    apiHandler.setProfileInformation(bio.value, pictureFile).then(() => {
      this.props.update();
      this.hide();
      location.reload();
    });
  }

  render() {
    const { visible, loading } = this.state;
    const { profile } = this.props;
    const actions = [{
      onClick: this.hide,
      primary: true,
      children: 'Discard changes',
      disabled: loading,
    }];

    actions.push(<Button flat primary disabled={loading} type="submit">Save changes</Button>);

    let content;
    if(!loading){
      content = (
        <span>
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
          onChange={this.handleLoad}
          accept="image/*"
          name="profilePicture"
          primary />
        <TextField id="profile-picture-file"
          placeholder="No file chosen"
          value={this.state.fileName}
          readOnly
          fullWidth={false} 
          className="profile-picture-file-textfield"/>
        </span>
      );
    } else {
      content = (
        <span className="loading">
        </span>
      );
    }
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
          {content}
        </DialogContainer>
      </form>
    );
  }
}
