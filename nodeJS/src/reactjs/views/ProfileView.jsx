import React from 'react';
import View from './View.jsx';
import Feed from '../components/feed/Feed.jsx';
import ProfileBanner from '../components/profile/ProfileBanner.jsx';
import { Route } from 'react-router-dom';
import FriendList from '../components/friends/FriendList.jsx';


export default class ProfileView extends View {
  constructor(props) {
    super(props);
    this.title = "Profile";
  }


  render() {
    return (
      <div>
        <ProfileBanner />
        <Route path="/profile/:username" exact render={props => <Feed {...props} />} />
        <Route path="/profile/:username/friends" exact render={props => <FriendList {...props} />} />
      </div>
    );
  }
}
