const Kernel = require('./Kernel');
const { mix } = require('./mixin');
const {
  debug: {
    any: debugAny,
    client: debug
  },
} = require('../config');
const { client: mixins } = require('./features');

class Client extends mix((() => {
  class ClientBase extends Kernel {
    constructor(...args) {
      super(...args);
      const { username, password } = args[0];
      this.username = username;
      this.password = password;
    }
  }
  Object.assign(ClientBase.prototype, {
    _className: 'Client',
    _showDebug: debug && debugAny,
  });
  return ClientBase;
})()).with(...mixins) {};

module.exports = Client;
