import React from 'react';
import { DialogContainer } from 'react-md';
import CommentCreate from './CommentCreate.jsx'
import CommentComponent from './CommentComponent.jsx'

class CommentDialog extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      visible: false
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  show(){
    this.setState({ visible: true });
  }

  hide(){
    this.setState({ visible: false });
  }

  render() {
    const { visible } = this.state;
    return (
      <DialogContainer
        id="simple-list-dialog"
        visible={visible}
        title="test title dialog"
        onHide={this.hide}
        focusOnMount={false} >  
        <CommentComponent />
        <CommentComponent />
        <CommentComponent />
        <CommentCreate />
      </DialogContainer>
    );
  }
}

export default CommentDialog;