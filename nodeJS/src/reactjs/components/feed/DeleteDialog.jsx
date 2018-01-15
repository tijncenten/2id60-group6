import React from 'react';
import { DialogContainer, Button } from 'react-md';

export default class DeleteDialog extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      visible: false,
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.delete = this.delete.bind(this);
  }

  show(){
    this.setState({
      visible: true,
    });
  }

  hide(){
    this.setState({ visible: false });
  }

  delete() {
    this.hide()
    this.props.deletePost(this.props.id);
  }

  render() {
    const { visible } = this.state;

    const actions = [{
      onClick: this.hide,
      primary: true,
      children: 'No thanks',
    }, {
      onClick: this.delete,
      primary: true,
      children: 'Delete post',
    }];

    return (
      <DialogContainer
        id="simple-list-dialog"
        visible={visible}
        title="Delete post"
        onHide={this.hide}
        focusOnMount={false}
        modal
        actions={actions} >
        <p> Are you sure that you want to delete this post?</p>
      </DialogContainer>
    );
  }
}
