const {
  ENTITY_TYPE_ENTITY,
  ENTITY_TYPE_USER,
  ENTITY_TYPE_COMMENT,
} = require('../../constants');
const Entity = require('./entity/Entity');
const EntityUser = require('./entity/User');
const EntityComment = require('./entity/Comment');

module.exports = {
  [ENTITY_TYPE_ENTITY]: Entity,
  [ENTITY_TYPE_USER]: EntityUser,
  [ENTITY_TYPE_COMMENT]: EntityComment,
};
