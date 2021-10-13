const Kernel = require('./Kernel');
const { mix } = require('./mixin');
const ServerStore = require('./ServerStore');
const {
  debug: {
    any: debugAny,
    server: debug
  }
} = require('../config');
const { server: mixins } = require('./features');

class Server extends mix((() => {
  class ServerBase extends Kernel {
    constructor(...args) {
      super(...args);
      this.store = new ServerStore();
    }
  }
  Object.assign(ServerBase.prototype, {
    _className: 'Server',
    _showDebug: debug && debugAny,
  });
  return ServerBase;
})()).with(...mixins) {};

module.exports = Server;
