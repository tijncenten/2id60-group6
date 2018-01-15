import React from 'react';
import NotificationComponent from './NotificationComponent.jsx';
import apiHandler from '../../../js/apiHandler';

const data = [
  { notificationType: "friendRequest", profile:{ name: "John", initials: "JD" }, date: "2018-3-1"},
  { notificationType: "postShared", profile:{ name: "John", initials: "JD" }, date: "2018-3-1"},
  { notificationType: "postShared", profile:{ name: "John", initials: "JD" }, date: "2018-3-1"},
]

export default class NotificationFeed extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      requests: null
    }

    this.update = this.update.bind(this);
  }

  componentDidMount(){
    this.update();
  }
  
  update(){
    apiHandler.getFriendRequests().then((result) => {
      this.setState({
        requests: result,
      });
    });
  }

  render() {
    let content;
    if(this.state.requests === null){
      content = (
        <span className="loading">
        </span>
      );
    } else if (this.state.requests.length === 0){
      content = (    
        <div className="center">
          <h1>It looks very empty over here.</h1>
          <p>You have no notifications</p>
        </div>
      );
    } else {
      content = (
        this.state.requests.map(request => (
          <NotificationComponent key={request.sender} data={request} update={this.update}/>
        ))        
      );
    }
    return (
      <div className="notification-feed-body">
        {content}
      </div>
    );
  }
}
