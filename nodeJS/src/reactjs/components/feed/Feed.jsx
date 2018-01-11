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

  constructor(props) {
    super(props);

    this.state = {
      posts: [
        { id: 0,  username: 'John', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          date: '3-1-2018', likes: 0},
        { id: 1, username: 'Jane', message: 'Der nachste freund hat keine schwester.',
          date: '5-1-2018', likes: 3},
        { id: 2, username: 'Richard', message: 'I follow the moskva, down to gorky park, listening to the wind of change',
          date: '6-1-2018', likes: 21},
        { id: 3, username: 'Svetlana', message: 'Unconquered city on vltlavas shore is protected by its people',
          date: '6-1-2018', likes: 4}
      ]
    }

  }

  createPost(message) {

    // Get current date
    var d = new Date();
    var date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();

    const newPost = { id: this.state.posts.length, username: "Anon", message, date, likes: 0 }
    this.setState({ posts: [newPost].concat(this.state.posts)});
    console.log(this.state.posts);
  }

  loadPosts() {
    return this.state.posts.map( post =>
      <FeedComponent
        key = {post.id}
        username = {post.username}
        message = {post.message}
        date = {post.date}
        likes = {post.likes}
        liked = {false} />
      // TODO determine whether the user has liked this comment
    );
  }

  render() {
    const posts = this.loadPosts();

    return (

      <div className="feed-body">
        <PostCreate createPost = { this.createPost.bind(this) } />
        {posts}
      </div>
    );
  }
}
