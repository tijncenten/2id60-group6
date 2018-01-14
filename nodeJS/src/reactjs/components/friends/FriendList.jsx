import React from 'react';
import FriendComponent from './FriendComponent.jsx';
import apiHandler from '../../../js/apiHandler';

export default class FriendList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      friends: null,
      isMyself: false
    }
  }

  componentDidMount() {
    apiHandler.getFriendsByProfileId(this.props.profile.id).then(result => {
      this.setState({
        friends: result
      });
    });
    if(this.props.profile.relation.type === "self"){
      this.setState({
        isMyself: true
      });
    }
  }

  loadProfiles() {
    return this.state.friends.map(profile =>
      <FriendComponent
        key={profile.id}
        profile={profile}
        isMyself={this.state.isMyself}
        deleteFriend={this.deleteFriend.bind(this)} />
    )
  }

  deleteFriend(id) {
    // Remove the friend matching the given id from the list
    var newProfiles = this.state.profiles;
    newProfiles.splice(this.state.profiles.findIndex(function(el){
      return el.id == id;
    }), 1);
   this.setState({profiles: newProfiles})
    // TODO: Send to backend
  }

  render() {
    if(this.state.friends === null){
      return (
        <div>
          <span className="loading">
          </span>
        </div>
      );
    }
    const profiles = this.loadProfiles();
    return (
      <div className="friend-list-body">
        {profiles}
        <div className="friend-list-component empty-div"></div>
      </div>
    );
  }
}
