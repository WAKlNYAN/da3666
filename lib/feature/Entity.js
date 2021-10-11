module.exports = {
  server: (() => {
    return (superclass) => class extends superclass {
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
    }
  })(),

  client: (() => {
    return (superclass) => class extends superclass {
      getRPCMethods() {
        return {
          ...super.getRPCMethods(),
          'getEntityById': this.call.bind(this, 'getEntityById'),
          'addEntity': this.call.bind(this, 'addEntity'),
        };
      }
    }
  })(),
};
