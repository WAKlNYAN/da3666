const {
  ENTITY_TYPE_ENTITY,
} = require('../../constants');
const { namespace } = require('../mixin');
const ns = namespace(ENTITY_TYPE_ENTITY);

const serverMixin = (superclass) => class extends superclass {
  getEntityById(options) {
    const { userId } = this.getUserByToken(options);
    const { id } = options;
    return this.store.getEntityById(userId, id);
  }

  addEntity(options) {
    const { userId } = this.getUserByToken(options);
    return this.store.addEntity(userId, this.cleanOptions(options));
  }

  getRPCMethods() {
    const { addEntity, getEntityById } = this;
    return {
      ...super.getRPCMethods(),
      'addEntity': addEntity,
      'getEntityById': getEntityById,
    };
  }
};

const clientMixin = (superclass) => class extends superclass {
  getRPCMethods() {
    return {
      ...super.getRPCMethods(),
      'getEntityById': this.call.bind(this, 'getEntityById'),
      'addEntity': this.call.bind(this, 'addEntity'),
    };
  }
};

module.exports = {
  server: serverMixin,
  client: clientMixin,
  entity: undefined,
};
