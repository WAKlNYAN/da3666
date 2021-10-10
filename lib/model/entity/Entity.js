const Class = require('../../Class');
const {
  debug: {
    any: debugAny,
    entity: debug
  },
} = require('../../../config');
const {
  ENTITY_TYPE_ENTITY
} = require('../../../constants');

class Entity extends Class {
  constructor() {
    this.type = ENTITY_TYPE_ENTITY;
  };
};
Object.assign(Entity.prototype, {
  _className: 'Entity',
  _showDebug: debug && debugAny,
  _auxMethods: undefined,
});

module.exports = Entity;
