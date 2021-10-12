const Class = require('./Class');
const { mix } = require('./mixin');
const {
  debug: {
    any: debugAny,
    client: debug
  },
} = require('../config');
const { client: mixins } = require('./features');

class ClientBase extends Class {
  constructor(...args) {
    super(...args);
    const { username, password } = args[0];
    this.username = username;
    this.password = password;
  }

  initialize() {
    return Promise.resolve();
  }

  getRPCMethods() {
    return {};
  }
}
Object.assign(ClientBase.prototype, {
  _className: 'Client',
  _showDebug: debug && debugAny,
});

class Client extends mix(ClientBase).with(...mixins) {};

module.exports = Client;
