import React from 'react';
import PostCreate from './PostCreate.jsx';
import FeedComponent from './FeedComponent.jsx';
import FeedComponentAlbum from './FeedComponentAlbum.jsx';

const authors = [
  { name: "John", initials: "JD" },
  { name: "Jane", initials: "AB" },
  { name: "Richard", initials: "RR" },
]

export default class Feed extends React.Component {
  render() {
    return (
      <div className="feed-body">
        <PostCreate />
        <FeedComponent author={authors[0]} postDate="2018-3-1" postText="Test Post Text" liked={false} />
        <FeedComponentAlbum author={authors[1]} postDate="2018-3-1" postText="Test Other Text" liked={true} />
        <FeedComponent author={authors[2]} postDate="2018-1-1" postText="Test ja lkb Text" liked={false} />
        <FeedComponent author={authors[1]} postDate="2018-3-1" postText="Test Pjad ;kljost Text" liked={false} />
        <FeedComponent author={authors[2]} postDate="2018-2-1" postText="Test Pod j;alkst Text" liked={true} />
      </div>
    );
  }
}
