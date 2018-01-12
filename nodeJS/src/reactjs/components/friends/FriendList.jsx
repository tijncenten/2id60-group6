import React from 'react';
import FriendComponent from './FriendComponent.jsx';

const data = [
  { profile:{ fullname: "John 1", initials: "JD" },   date: "2018-3-1"},
  { profile:{ fullname: "Jane 2", initials: "JD" },   date: "2018-6-1"},
  { profile:{ fullname: "Richaard 3", initials: "JD" },   date: "2018-2-1"},
  { profile:{ fullname: "John 4", initials: "JD" },   date: "2018-3-1"},
  { profile:{ fullname: "Jane 5", initials: "JD" },   date: "2018-6-1"},
  { profile:{ fullname: "Richaard 6", initials: "JD" },   date: "2018-2-1"},
  { profile:{ fullname: "John doe", initials: "JD" },   date: "2018-3-1"},
  { profile:{ fullname: "Jane doe", initials: "JD" },   date: "2018-6-1"},
  { profile:{ fullname: "Richaard doe", initials: "JD" },   date: "2018-2-1"},
]

export default class FriendList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      profiles: [
        { id: 0, profile:{ fullname: "John 1", initials: "JD" },   date: "2018-3-1"},
        { id: 1, profile:{ fullname: "Jane 2", initials: "JD" },   date: "2018-6-1"},
        { id: 2, profile:{ fullname: "Richaard 3", initials: "JD" },   date: "2018-2-1"},
        { id: 3, profile:{ fullname: "John 4", initials: "JD" },   date: "2018-3-1"},
        { id: 4, profile:{ fullname: "Jane 5", initials: "JD" },   date: "2018-6-1"},
        { id: 5, profile:{ fullname: "Richaard 6", initials: "JD" },   date: "2018-2-1"},
        { id: 6, profile:{ fullname: "John doe", initials: "JD" },   date: "2018-3-1"},
        { id: 7, profile:{ fullname: "Jane doe", initials: "JD" },   date: "2018-6-1"},
        { id: 8, profile:{ fullname: "Richaard doe", initials: "JD" },   date: "2018-2-1"},
      ]
    }
  }

  loadProfiles() {
    return this.state.profiles.map( profile =>
      <FriendComponent
        key = {profile.id}
        id = {profile.id}
        profile = {profile.profile}
        date = {profile.date}
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
    const profiles = this.loadProfiles();
    return (
      <div className="friend-list-body">
        {profiles}
        <div className="friend-list-component empty-div"></div>
      </div>
    );
  }
}
