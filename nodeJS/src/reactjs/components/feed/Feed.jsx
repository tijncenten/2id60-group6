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
      posts: []
    }

    this.downloadPosts();
    this.uploadPost = this.uploadPost.bind(this);

  }

  createPost(message) {

    // Get current date
    var d = new Date();
    var date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();

    // TODO: find a viable id
    const newPost = { id: 0, user: activeUser.id, message, date, likes: 0 }
    this.setState({ posts: [newPost].concat(this.state.posts)});

    this.uploadPost(message);
  }

  downloadPosts() {
    // Get basic post information
    jQuery.ajax({
      method: 'GET',
      url: '/api/posts',
      success: (posts) => {

        this.setState({posts:
          posts.map( post => ({
              id: post.id,
              user: post.owner,
              message: post.content,
              date: post.date,
              likes: 0,
            })
          )
        })
      }
    });
  }

  uploadPost(message) {

    jQuery.ajax({
      method: 'POST',
      url: '/api/posts/new',
      data: {
        csrfmiddlewaretoken: csrf_token,
        placedOnProfile: activeUser.id,
        location: 'earth',
        content: message}
    });
  }

  loadPosts() {

    return this.state.posts.map( post =>
      <FeedComponent
        key = {post.id}
        user = {post.user}
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
