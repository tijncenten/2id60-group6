import React from 'react';
import View from './View.jsx';
import Feed from '../components/feed/Feed.jsx';
import ProfileBanner from '../components/profile/ProfileBanner.jsx';


export default class ProfileView extends View {
  constructor(props) {
    super(props);
    this.title = "Profile";
  }


  render() {
    return (
      <div>
        <ProfileBanner />
        <Feed />
      </div>
    );
  }
}
