const Class = require('./Class');
const { mix } = require('./mixin');
const WebSocketClient = require('rpc-websockets').Client;
const {
  ws: {
    port,
    address,
  },
  debug: {
    any: debugAny,
    client: debug
  },
} = require('../config');
const url = `ws://${address}:${port}`;
const { sha256 } = require('hash.js');
const { client: mixins } = require('./features');

class ClientBase extends Class {
  constructor(options) {
    super(options);
    const { username, password } = options;
    this.username = username;
    this.password = password;
    this.token = sha256().update(username+password).digest('hex');
    this.connected = false;
    this.authenticated = false;
    this.initializePromise = this.connect();
  }

  close() {
    this.webSocketClient.close();
  }

  connect() {
    const { username, password } = this;
    return new Promise((resolve, reject) => {
      this.webSocketClient = new WebSocketClient(url);
      this.webSocketClient
        .on('open', () => {
          this.connected = true;
          this.log('Connected');
          this.webSocketClient.login({
            username, password, token: this.token,
          }).then((bool) => {
            if (bool) {
              this.authenticated = true;
              resolve();
            } else {
              reject();
            }
            this.log(bool ? `Authenticated` : 'Denied');
          }).catch(reject);
        })
        .on('close', () => this.connected = false)
        .on('error', (data) => this.log.bind(this, data))
      ;
    });
  }

  initialize() {
    return this.initializePromise;
  }

  call(method, options) {
    const { token } = this;
    this.log('Calling '+method, options);
    const promise = this.webSocketClient.call(method, {
      token,
      ...options,
    });
    promise.catch(this.log.bind(this))
    return promise;
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