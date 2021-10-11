const WebSocketServer = require('rpc-websockets').Server;
const WebSocketClient = require('rpc-websockets').Client;
const {
  ws: {
    port,
    address,
  },
  debug: {
    any: debugAny,
    webSocket: debug
  }
} = require('../../config');
const url = `ws://${address}:${port}`;

module.exports = {
  server: (() => {
    function local(that) {
      return {
        listen: function() {
          const { authenticate } = local(this);
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
            this.webSocketServer.setAuth(authenticate);
          });
        }.bind(that),

        authenticate: function(options) {
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
        }.bind(that),
      };
    };

    return (superclass) => class extends superclass {
      constructor() {
        super();
        const { listen } = local(this);
        this.initializePromise = listen();
      }

      close() {
        this.webSocketServer.close();
      }

      initialize() {
        return this.initializePromise;
      }
    }
  })(),

  client: (() => {
    function local(that) {
      return {
        connect: function() {
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
        }.bind(that),
      };
    };

    return (superclass) => class extends superclass {
      constructor(...args) {
        super(...args);
        const { connect } = local(this);
        this.connected = false;
        this.authenticated = false;
        this.initializePromise = connect();
      }

      close() {
        this.webSocketClient.close();
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
  })(),
};
