// Makes things sillier
const { localFactory, setRPCMethods } = require('../util');

const rpcSetup = setRPCMethods([
  'beSilly'
]);

module.exports = {
  server: (() => {
    return (superclass) => class extends superclass {
      constructor(...args) {
        super(...args);
        rpcSetup(this);
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
