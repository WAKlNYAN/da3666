const {
  ENTITY_TYPE_ENTITY,
  ENTITY_TYPE_COMMENT,
} = require('../../constants');

const { entity: EntityComment } = require('../feature/comment/Comment');
const Entity = require('./entity/Entity');

module.exports = {
  [ENTITY_TYPE_ENTITY]: Entity,
  [ENTITY_TYPE_COMMENT]: EntityComment,
};
