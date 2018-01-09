import React from 'react';
import View from './View.jsx';
import NotificationFeed from '../components/notifications/NotificationFeed.jsx'

export default class NotificationView extends View {
  constructor(props) {
    super(props);
    this.title = "Notifications";
  }


  render() {
    return (
      <div>
        <NotificationFeed />
      </div>
    );
  }
}
