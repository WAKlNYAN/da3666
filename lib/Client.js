const Class = require('./Class');
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
const WebSocketClient = require('rpc-websockets').Client;
const url = `ws://${address}:${port}`;
const { sha256 } = require('hash.js');
const { client: auxMethods } = require('./model/features');

class Client extends Class {
  constructor(options) {
    super(options);
    const { username, password } = options;
    this.username = username;
    this.password = password;
    this.token = sha256().update(username+password).digest('hex');
    this.connected = false;
    this.authenticated = false;
    this.initializePromise = this.connect();

    Object.keys(auxMethods).forEach(method => {
      this[method] = auxMethods[method].bind(this);
    });
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
}
Object.assign(Client.prototype, {
  _className: 'Client',
  _showDebug: debug && debugAny,
  _auxMethods: auxMethods,
});

module.exports = Client;
