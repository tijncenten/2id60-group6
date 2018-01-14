import React from 'react';
import PostCreate from './PostCreate.jsx';
import FeedComponent from './FeedComponent.jsx';
import FeedComponentAlbum from './FeedComponentAlbum.jsx';
import apiHandler from '../../../js/apiHandler';

export default class Feed extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      posts: []
    }
  }

  componentDidMount() {
    this.downloadPosts(this.props.profile);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.profile != nextProps.profile) {
      this.downloadPosts(nextProps.profile);
    }
  }

  createPost(message) {
    if (message != "" && message != null){
      const createPostCallback = (post) => {
        this.setState({
          posts: [post].concat(this.state.posts)
        });
      };
      if (this.props.profile === undefined) {
        apiHandler.createPost(activeUser.id, "Amsterdam", message).then(createPostCallback);
      } else {
        apiHandler.createPost(this.props.profile.id, "Amsterdam", message).then(createPostCallback);
      }
    }
  }

  deletePost(id) {
    var newPosts = this.state.posts;
    newPosts.splice(this.state.posts.findIndex(function(el){
      return el.id == id;
    }), 1);
    this.setState( {posts: newPosts} );

    apiHandler.postDelete(id);
  }

  downloadPosts(profile) {
    const postCallback = (posts) => {
      this.setState({
        posts: posts
      });
    };
    if (profile === undefined) {
      apiHandler.getFeedPosts().then(postCallback);
    } else {
      if(profile != undefined){
        apiHandler.getProfilePosts(profile.id).then(postCallback);
      }
    }
  }

  render() {
    return (
      <div className="feed-body">
        <PostCreate createPost = { this.createPost.bind(this) } />
        {this.state.posts.map(post => (
          <FeedComponent
            key={post.id}
            deletePost={ this.deletePost.bind(this) }
            data={post} />
        ))}
      </div>
    );
  }
}
