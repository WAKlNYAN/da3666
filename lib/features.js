const comment = require('./feature/Comment');
const entity = require('./feature/Entity');

module.exports = {
  server: [
    comment.server,
    entity.server,
  ],
  client: [
    comment.client,
    entity.client,
  ],
  entity: {},
};
