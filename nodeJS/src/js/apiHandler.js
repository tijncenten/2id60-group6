import { Avatar } from 'react-md';

export default new class {
  async getProfileByUserName(username){
    const result = await jQuery.ajax({
      method: 'GET',
      url: `/api/profiles/username/${username}`
    });
    return parseProfile(result);
  }

  async setProfileInformation(bio, pictureUri = null) {
    let formData = new FormData();
    formData.append('csrfmiddlewaretoken', csrf_token);
    formData.append('bio', bio.trim());
    if(pictureUri !== null) {
      formData.append('profilePicture', pictureUri);
    }

    return await jQuery.ajax({
      method: 'PATCH',
      url: `/api/profiles/me`,
      data: formData,
      processData: false,
      contentType: false,
      headers: {
        "Accept": "application/json",
        "X-CSRFTOKEN": csrf_token,
      },
    });
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

  async addFriend(id){
    await jQuery.ajax({
      method: 'POST',
      url: `/api/profiles/me/friends/requests/`,
      data: {
        csrfmiddlewaretoken: csrf_token,
        receiver: id,
      }
    })
  }

  async deleteFriend(fk){
    await jQuery.ajax({
      method: 'DELETE',
      url: `/api/profiles/me/friends/${fk}/`,
      headers: {
        "X-CSRFTOKEN": csrf_token,
      }
    })
  }

  async acceptFriendRequest(fk){
    await jQuery.ajax({
      method: 'GET',
      url: `/api/profiles/me/friends/requests/${fk}/accept`,
      headers: {
        "X-CSRFTOKEN": csrf_token,
      }
    })
  }

  async declineFriendRequest(fk){
    await jQuery.ajax({
      method: 'DELETE',
      url: `/api/profiles/me/friends/requests/${fk}/`,
      headers: {
        "X-CSRFTOKEN": csrf_token,
      }
    })
  }

  async getFriendRequests(){
    const result = await jQuery.ajax({
      method: 'GET',
      url: `/api/profiles/me/friends/requests/`,
      headers: {
        "X-CSRFTOKEN": csrf_token,
      }
    })
    return parseFriendRequests(result);
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

  async postDelete(id) {
    await jQuery.ajax({
      method: 'DELETE',
      url: `/api/posts/${id}`,
      headers: {
        "X-CSRFTOKEN": csrf_token,
      }
    })
  }

  async getComments(id) {
    const result = await jQuery.ajax({
      method: 'GET',
      url: `/api/posts/${id}/comments`,
    });
    return parseComments(result);
  }

  async createComment(postId, content) {
    const result = await jQuery.ajax({
      method: 'POST',
      url: `/api/posts/${postId}/comments`,
      data: {
        csrfmiddlewaretoken: csrf_token,
        content: content,
      }
    });
    return parseComment(result);
  }

  async postLike(id) {
    await jQuery.ajax({
      method: 'POST',
      url: `/api/posts/${id}/likes`,
      data: {
        csrfmiddlewaretoken: csrf_token,
      }
    });
  }

  async postUnlike(id) {
    await jQuery.ajax({
      method: 'DELETE',
      url: `/api/posts/${id}/likes`,
      headers: {
        "X-CSRFTOKEN": csrf_token,
      }
    });
  }

  async commentLike(postId, commentId) {
    await jQuery.ajax({
      method: 'POST',
      url: `/api/posts/${postId}/comments/${commentId}/likes`,
      data: {
        csrfmiddlewaretoken: csrf_token,
      }
    });
  }

  async commentUnlike(postId, commentId) {
    await jQuery.ajax({
      method: 'DELETE',
      url: `/api/posts/${postId}/comments/${commentId}/likes`,
      headers: {
        "X-CSRFTOKEN": csrf_token,
      }
    });
  }

  async commentDelete(postId, commentId) {
    await jQuery.ajax({
      method: 'DELETE',
      url: `/api/posts/${postId}/comments/${commentId}`,
      headers: {
        "X-CSRFTOKEN": csrf_token,
      }
    });
  }

  async postShare(id, content, location) {
    const result = await jQuery.ajax({
      method: 'POST',
      url: `/api/posts/${id}/share`,
      headers: {
        "X-CSRFTOKEN": csrf_token,
      },
      data: {
        content: content,
        location: location,
      }
    });
    return parsePost(result);
  }

  async getChats() {
    const result = await jQuery.ajax({
      method: 'GET',
      url: `/api/chats`,
      headers: {
        "X-CSRFTOKEN": csrf_token,
      }
    });
    return parseChats(result);
  }

  async getChatMessages(id) {
    const result = await jQuery.ajax({
      method: 'GET',
      url: `/api/chats/${id}/messages`,
      headers: {
        "X-CSRFTOKEN": csrf_token,
      }
    });
    return parseChatMessages(result);
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
  const hours = (date.getHours() === 0) ? "00" : date.getHours();
  const minutes = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
  post.date = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()} ${hours}:${minutes}`;
  if(post.postType === "shared"){
    post.sharedPost = parsePost(post.sharedPost);
  }
  return post;
};

const parseComments = (comments) => {
  return comments.map(comment => (
    parseComment(comment)
  ));
}

const parseComment = (comment) => {
  if(comment.profile == 'self'){
    comment.profile = activeUser;
  }
  comment.profile = parseProfile(comment.profile);
  const date = new Date(comment.date);
  const hours = (date.getHours() === 0) ? "00" : date.getHours();
  const minutes = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
  comment.date = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()} ${hours}:${minutes}`;
  return comment;
}

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
    requesttype: profile.relation.requestType,
  }));
}

const parseFriendRequests = (requests) => {
  return requests.map(request => (
    parseFriendRequest(request)
  ));
}

const parseFriendRequest = (request) => {
  if(request.firstName === undefined || request.lastName === undefined){
    return request;
  }
  const colorArray = Avatar.defaultProps.suffixes;
  const total = request.firstName.charCodeAt(0) + request.lastName.charCodeAt(0);
  request.avatarColor = colorArray[total%colorArray.length];

  const date = new Date(request.date);
  const hours = (date.getHours() === 0) ? "00" : date.getHours();
  const minutes = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
  request.date = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()} ${hours}:${minutes}`;
  return request;
}

const parseChats = (chats) => {
  return chats.map(chat => (
    parseChat(chat)
  ));
}

const parseChat = (chat) => {
  chat.profile = parseProfile(chat.profile);
  const date = new Date(chat.date);
  const hours = (date.getHours() === 0) ? "00" : date.getHours();
  const minutes = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
  chat.date = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()} ${hours}:${minutes}`;
  return chat;
}

const parseChatMessages = (messages) => {
  return messages.map(message => (
    parseChatMessage(message)
  ));
}

const parseChatMessage = (message) => {
  const date = new Date(message.timestamp);
  const hours = (date.getHours() === 0) ? "00" : date.getHours();
  const minutes = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
  message.timestamp = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()} ${hours}:${minutes}`;
  return message;
}

activeUser = parseProfile(activeUser);
