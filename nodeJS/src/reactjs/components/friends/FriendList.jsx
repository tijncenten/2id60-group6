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
  render() {
    return (
      <div className="friend-list-body">
        <FriendComponent data={data[0]}/>
        <FriendComponent data={data[1]}/>
        <FriendComponent data={data[2]}/>
        <FriendComponent data={data[3]}/>
        <FriendComponent data={data[4]}/>
        <FriendComponent data={data[5]}/>
        <FriendComponent data={data[6]}/>
        <FriendComponent data={data[1]}/>
        <FriendComponent data={data[2]}/>
        <FriendComponent data={data[0]}/>
        <FriendComponent data={data[1]}/>
        <FriendComponent data={data[2]}/>
        <FriendComponent data={data[0]}/>
        <FriendComponent data={data[1]}/>
        <FriendComponent data={data[2]}/>
        <FriendComponent data={data[0]}/>
        <FriendComponent data={data[1]}/>
        <FriendComponent data={data[2]}/>
        <FriendComponent data={data[2]}/>
        <div className="friend-list-component empty-div"></div>
      </div>
    );
  }
}
