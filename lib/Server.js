const Class = require('./Class');
const { mix } = require('./mixin');
const WebSocketServer = require('rpc-websockets').Server;
const ServerStore = require('./ServerStore');
const {
  ws: {
    port,
    address,
  },
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
    this.initializePromise = this.listen();
  }

  close() {
    this.webSocketServer.close();
  }

  listen() {
    const rpcMethods = this.getRPCMethods();
    return new Promise((resolve, reject) => {
      this.webSocketServer = new WebSocketServer({
        port,
        host: address,
      });
      this.webSocketServer.on('listening', () => {
        this.log('Listening');
        resolve();
      });
      Object.keys(rpcMethods).forEach(methodName => {
        this.webSocketServer.register(
          methodName,
          function() {
            this.log('Executing RPC '+methodName);
            return rpcMethods[methodName].apply(this, arguments);
          }.bind(this)
        );
      });
      this.webSocketServer.setAuth(this.authenticate.bind(this));
    });
  }

  initialize() {
    return this.initializePromise;
  }

  authenticate(options) {
    const { token, username, password } = options;
    const success = (
      username === 'Bob' && password === 'xyzzy'
    );
    if (success) {
      this.tokens[token] = {
        ...options,
        userId: 0
      };
    }
    return success;
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
