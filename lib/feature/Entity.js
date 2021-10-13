const { setRPCMethods2 } = require('../util');

const rpcSetup = setRPCMethods2({
  'getEntityById': function(...args) {
    return this.getEntityById(...args);
  },
  'addEntity': function(...args) {
    return this.addEntity(...args);
  },
});

module.exports = {
  server: (() => {
    return (superclass) => class extends superclass {
      constructor(...args) {
        super(...args);
        rpcSetup(this);
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
      constructor(...args) {
        super(...args);
        rpcSetup(this);
      }
    }
  })(),
};
