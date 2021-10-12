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
    }
  })(),

  client: (() => {
    return (superclass) => class extends superclass {
    }
  })(),
};
