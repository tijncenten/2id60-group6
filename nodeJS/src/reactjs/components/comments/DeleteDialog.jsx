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
    this.props.deleteComment(this.props.id);
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
      children: 'Delete comment',
    }];

    return (
      <DialogContainer
        id="simple-list-dialog"
        visible={visible}
        title="Delete comment"
        onHide={this.hide}
        focusOnMount={false}
        modal
        actions={actions}
        portal={true}
        lastChild={true}
        disableScrollLocking={true}
        renderNode={document.body} >
        <p> Are you sure that you want to delete this comment?</p>
      </DialogContainer>
    );
  }
}
