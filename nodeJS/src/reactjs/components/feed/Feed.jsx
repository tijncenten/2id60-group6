import React from 'react';
import PostCreate from './PostCreate.jsx';
import FeedComponent from './FeedComponent.jsx';
import FeedComponentAlbum from './FeedComponentAlbum.jsx';
import apiHandler from '../../../js/apiHandler';

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
  }
  
  componentDidMount(){
    this.downloadPosts();
  }

  componentWillReceiveProps(nextProps){
    if(this.props.profile != nextProps.profile){
      this.downloadPosts();
    }
  }

  createPost(message) {
    const createPostCallback = (post) => {
      console.log(post);
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

  downloadPosts() {
    const postCallback = (posts) => {
      this.setState({
        posts: posts
      });
    };

    if (this.props.profile === undefined) {
      apiHandler.getFeedPosts().then(postCallback);
    } else {
      if(this.props.profile != undefined){
        apiHandler.getProfilePosts(this.props.profile.id).then(postCallback);
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
            data={post} />
        ))} 
      </div>
    );
  }
}
