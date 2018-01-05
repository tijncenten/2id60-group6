import React from 'react';
import { Paper, Avatar, Button, FontIcon } from 'react-md';

class CommentComponent extends React.Component {
  render() {
    return (
      <div>
        <Avatar random className="comment-avatar">JD</Avatar>
        <div className="md-paper md-paper--1 chat-message comment-message">
          <div>
            <strong>John</strong> test ingl al asas dfffffff ffffffffffff ffffff ffffa sdfa sdfa sdf
            testinglalasasdfffffffffffffffffffffffffffffasdfasdfasdf
          </div>
          <div className="comment-info-wrapper">
            <div className="comment-date">
              5-1-2018 17:16
            </div>
            <div className="inline-block">
              <FontIcon primary>thumb_up</FontIcon>
              <div className="number-of-likes">
                7    
              </div>      
            </div>
            <Button flat primary className="comment-like-button">like</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default CommentComponent