var coreapi = window.coreapi;  // Loaded by `coreapi.js`
var schema = window.schema;    // Loaded by `schema.js`

export default apiHandler = new class {
  constructor() {
    let auth = new coreapi.auth.SessionAuthentication({
      csrfCookieName: 'csrftoken',
      csrfHeaderName: 'X-CSRFToken'
    });
    this.client = new coreapi.Client({auth: auth});
  }

  
  async getPosts() {
    var action = ["posts", "list"];
    const result = await this.client.action(schema, action);
    return result;
  }

  async createPost(placedOnProfileId, location, content) {
    var action = ["posts", "new", "create"]
    var params = {
        placedOnProfile: placedOnProfileId,
        location: location,
        content: content,
    }
    const result = await this.client.action(schema, action, params);
    return result;
  }

  async deltePost(postId) {
    var action = ["posts", "delete"]
    var params = {
        id: postId,
    }
    const result = await this.client.action(schema, action, params);
    return result;
  }

  async sharePost(sharedPostId, location, content) {
    var action = ["posts", "share > create"]
    var params = {
        id: sharedPostId,
        location: location,
        content: content,
    }
    const result = await this.client.action(schema, action, params);
    return result;
  }
}