import React from 'react';
import { Paper, DialogContainer, Button, TextField, Card, CardText, CardTitle } from 'react-md';

export default class ShareDialog extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      visible: false,
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.handleShare = this.handleShare.bind(this);
  }

  show(){
    this.setState({ visible: true });
  }

  hide(){
    this.setState({ visible: false });
  }

  handleShare(){
    this.hide();
    this.props.sharePost(this.props.data.id, this.message.value);
  }

  render() {
    const { visible } = this.state;
    const { id, owner, date } = this.props.data;

    const actions = [{
      onClick: this.hide,
      primary: false,
      children: 'Cancel',
    }, {
      onClick: this.handleShare,
      primary: true,
      children: 'Share',
    }];

    return (
      <DialogContainer
        id="simple-list-dialog"
        visible={visible}
        title="Sharing"
        onHide={this.hide}
        focusOnMount={false}
        dialogClassName="share-dialog"
        modal
        actions={actions} >
        <Button icon onClick={this.hide} className="dialog-close-button">close</Button>
        <TextField
          id="share-message"
          placeholder="Message"
          block
          rows={4}
          paddedBlock
          className="share-dialog-message md-paper md-paper--1"
          ref={(input) => this.message = input}
        />
        <div className="share-dialog-post">
          <p>sharing <strong>{owner.firstName}'s</strong> post from <strong>{date}</strong></p>
        </div>
      </DialogContainer>
    );
  }
}
