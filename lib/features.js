const comment = require('./feature/comment/Comment');

module.exports = {
  server: [
    comment.server,
  ],
  client: [
    comment.client,
  ],
  entity: {},
};
