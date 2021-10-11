const Class = require('./Class');
const { mix } = require('./mixin');
const ServerStore = require('./ServerStore');
const {
  debug: {
    any: debugAny,
    server: debug
  }
} = require('../config');
const { server: mixins } = require('./features');

class ServerBase extends Class {
  constructor() {
    super();
    this.tokens = {};
    this.store = new ServerStore();
  }

  initialize() {
    return Promise.resolve();
  }

  cleanOptions(options) {
    const { token, ...newOptions } = options;
    return newOptions;
  }

  getUserByToken({ token }) {
    return this.tokens[token];
  }

  getRPCMethods() {
    return {};
  }
}
Object.assign(ServerBase.prototype, {
  _className: 'Server',
  _showDebug: debug && debugAny,
});

class Server extends mix(ServerBase).with(...mixins) {};

module.exports = Server;
