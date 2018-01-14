import React from 'react';
import { DialogContainer, Button } from 'react-md';

export default class DeleteFriendDialog extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      visible: false,
      fullname: ""
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.delete = this.delete.bind(this);
  }

  show(name){
    this.setState({
      visible: true,
      fullname: name
    });
    console.log("show functie")
    console.log(name)
  }

  hide(){
    this.setState({ visible: false });
  }

  delete() {
    this.hide()
    this.props.deleteFriend(this.props.id);
  }

  render() {
    const { visible } = this.state;

    const actions = [{
      onClick: this.delete,
      primary: true,
      children: 'Yes, delete friend',
    }, {
      onClick: this.hide,
      primary: true,
      children: 'No thanks',
    }];

    return (
      <DialogContainer
        id="simple-list-dialog"
        visible={visible}
        title="Delete friend"
        onHide={this.hide}
        focusOnMount={false}
        modal
        actions={actions} >
        <p> Are you sure that you want to delete <strong>{this.state.fullname}</strong> from your friend list?</p>
      </DialogContainer>
    );
  }
}
