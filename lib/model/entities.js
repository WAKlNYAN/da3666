const {
  ENTITY_TYPE_ANY,
  ENTITY_TYPE_USER,
} = require('../../constants');
const Entity = require('./entity/Entity');
const EntityUser = require('./entity/User');

module.exports = {
  [ENTITY_TYPE_ANY]: Entity,
  [ENTITY_TYPE_USER]: EntityUser,
};
