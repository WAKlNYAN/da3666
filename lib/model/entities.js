const {
  ENTITY_TYPE_ENTITY,
  ENTITY_TYPE_USER,
  ENTITY_TYPE_COMMENT,
  ENTITY_TYPE_LINK,
} = require('../../constants');
const { entity: EntityComment } = require('../feature/comment/Comment');
const Entity = require('./entity/Entity');
const EntityUser = require('./entity/User');
const EntityLink = require('./entity/Link');

module.exports = {
  [ENTITY_TYPE_ENTITY]: Entity,
  [ENTITY_TYPE_USER]: EntityUser,
  [ENTITY_TYPE_COMMENT]: EntityComment,
  [ENTITY_TYPE_LINK]: EntityLink,
};
