import React from 'react';
import NotificationComponent from './NotificationComponent.jsx';

const data = [
  { notificationType: "friendRequest", profile:{ name: "John", initials: "JD" }, date: "2018-3-1"},
  { notificationType: "postShared", profile:{ name: "John", initials: "JD" }, date: "2018-3-1"},
  { notificationType: "postShared", profile:{ name: "John", initials: "JD" }, date: "2018-3-1"},
]

export default class NotificationFeed extends React.Component {
  render() {
    return (
      <div className="notification-feed-body">
        <NotificationComponent data={data[0]}/>
        <NotificationComponent data={data[1]}/>
        <NotificationComponent data={data[2]}/>
      </div>
    );
  }
}
