export default new class {
  async getProfileByUserName(username){
    const result = await jQuery.ajax({
      method: 'GET',
      url: `/api/profiles/username/${username}/`
    });
    return parsePosts(result);
  }
  
  async getPosts() {
    const result = await jQuery.ajax({
      method: 'GET',
      url: '/api/posts',
    });
    return parsePosts(result);
  }

  async getProfilePosts(id) {
    const result = await jQuery.ajax({
      method: 'GET',
      url: `/api/profiles/${id}/posts`,
    });
    return parsePosts(result); 
  }

  async getFeedPosts() {
    const result = await jQuery.ajax({
      method: 'GET',
      url: '/api/feed',
    });
    return parsePosts(result);
  }

  async createPost(placedOnProfileId, location, content) {
    const result = await jQuery.ajax({
      method: 'POST',
      url: '/api/posts/new',
      data: {
        csrfmiddlewaretoken: csrf_token,
        placedOnProfile: placedOnProfileId,
        location: location,
        content: content}
    });
    return parsePost(result);
  }
}

const parsePosts = (posts) => {
  return posts.map(post => (
    parsePost(post)
  ));
};

const parsePost = (post) => {
  if(post.owner == 'self'){
    post.owner = activeUser;
  }
  if(post.placedOnProfile == 'owner'){
    post.placedOnProfile = post.owner;
  }
  if(post.placedOnProfile == 'self'){
    post.placedOnProfile = activeUser;
  }
  const date = new Date(post.date);
  post.date = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
  return post;
};