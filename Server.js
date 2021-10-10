const Class = require('./lib/Class');
const WebSocketServer = require('rpc-websockets').Server;
const ServerStore = require('./lib/ServerStore');
const {
  ws: {
    port,
    address,
  },
  debug: {
    any: debugAny,
    server: debug
  }
} = require('./config');
const { server: auxMethods } = require('./lib/model/features');

class Server extends Class {
  constructor() {
    super();
    this.tokens = {};
    this.store = new ServerStore();
    this.initializePromise = this.listen();
  }

  listen() {
    const { _auxMethods: auxMethods } = Object.getPrototypeOf(this);
    return new Promise((resolve, reject) => {
      this.webSocketServer = new WebSocketServer({
        port,
        host: address,
      });
      this.webSocketServer.on('listening', () => {
        this.log('Listening');
        resolve();
      });
      [...Object.keys(auxMethods || []), 'getEntityById', 'addEntity'].forEach(method => {
        this.webSocketServer.register(method, this[method].bind(this));
      });
      this.webSocketServer.setAuth(this.authenticate.bind(this));
    });
  }

  initialize() {
    return this.initializePromise;
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
}
Object.assign(Server.prototype, {
  _className: 'Server',
  _showDebug: debug && debugAny,
  _auxMethods: auxMethods,
});

module.exports = Server;
