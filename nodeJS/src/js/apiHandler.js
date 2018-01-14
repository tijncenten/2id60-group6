import { Avatar } from 'react-md';

export default new class {
  async getProfileByUserName(username){
    const result = await jQuery.ajax({
      method: 'GET',
      url: `/api/profiles/username/${username}`
    });
    return parseProfile(result);
  }

  async getProfileBySearch(search, maximum){
    const result = await jQuery.ajax({
      method: 'GET',
      url: `/api/profiles?q=${encodeURIComponent(search)}&nr=${maximum}`
    })
    return parseProfilesSearch(result);
  }

  async getFriendsByProfileId(id) {
    const result = await jQuery.ajax({
      method: 'GET',
      url: `/api/profiles/${id}/friends`,
    })
    return parseProfiles(result);
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
    post.placedOnProfile = parseProfile(post.owner);
  }
  if(post.placedOnProfile == 'self'){
    post.placedOnProfile = activeUser;
  }
  post.owner = parseProfile(post.owner);
  post.placedOnProfile = parseProfile(post.placedOnProfile);
  const date = new Date(post.date);
  post.date = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
  return post;
};

const parseProfiles = (profiles) => {
  return profiles.map(profile => (
    parseProfile(profile)
  ));
}

const parseProfile = (profile) => {
  if(profile.firstName === undefined || profile.lastName === undefined){
    return profile;
  }
  const colorArray = Avatar.defaultProps.suffixes;
  const total = profile.firstName.charCodeAt(0) + profile.lastName.charCodeAt(0);
  profile.avatarColor = colorArray[total%colorArray.length];
  return profile;
}

const parseProfilesSearch = (profiles) => {
  return profiles.map(profile => ({
    id: profile.id,
    fullname: `${profile.firstName} ${profile.lastName}`,
    username: profile.username,
    relation: profile.relation.type,
  }));  
}

activeUser = parseProfile(activeUser);
