module.exports = {
  server: (() => {
    return (superclass) => class extends superclass {
      rpcCall(method, ...args) {
        if (method === 'getEntityById') {
          return this.getEntityById(...args);
        }
        if (method === 'addEntity') {
          return this.addEntity(...args);
        }
        return super.rpcCall(method, ...args);
      }

      getEntityById(options) {
        const { userId } = this.getUserByToken(options);
        const { id } = options;
        return this.store.getEntityById(userId, id);
      }

      addEntity(options) {
        const { userId } = this.getUserByToken(options);
        return this.store.addEntity(userId, this.cleanOptions(options));
      }
    }
  })(),

  client: (() => {
    return (superclass) => class extends superclass {
    }
  })(),
};
