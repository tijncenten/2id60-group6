import React from 'react';
import View from './View.jsx';
import Feed from '../components/feed/Feed.jsx';
import ProfileBanner from '../components/profile/ProfileBanner.jsx';
import { Route } from 'react-router-dom';
import FriendList from '../components/friends/FriendList.jsx';
import apiHandler from '../../js/apiHandler';


export default class ProfileView extends View {
  constructor(props) {
    super(props);
    this.title = "Profile";

    this.state = {
      profile: null,
    };

    this.update = this.update.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    this.update();
  }

  update(){
    apiHandler.getProfileByUserName(this.props.match.params.username).then(result => {
      this.setState({
        profile: result
      });
    });
  }

  render() {
    if(this.state.profile === null){
      return (
        <div>
          <span className="loading">
          </span>
        </div>
      );
    }
    return (
      <div>
        <ProfileBanner profile={this.state.profile} update={this.update}/>
        <Route path="/profile/:username" exact render={props => <Feed {...props} profile={this.state.profile} />} />
        <Route path="/profile/:username/friends" exact render={props => <FriendList {...props} profile={this.state.profile} />} />
      </div>
    );
  }
}
