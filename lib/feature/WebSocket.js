const WebSocketServer = require('rpc-websockets').Server;
const WebSocketClient = require('rpc-websockets').Client;
const { localFactory } = require('../util');
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
    const local = localFactory({
      listen: function() {
        const {
          registerRPCMethods,
        } = local(this);
        this.whileInitializing(new Promise((resolve, reject) => {
          this.webSocketServer = new WebSocketServer({
            port,
            host: address,
          });
          this.webSocketServer.on('listening', () => {
            this.log('Listening');
            resolve();
          });
          registerRPCMethods();
        }));
      },

      registerRPCMethods: function() {
        this.rpcList().forEach(methodName => {
          this.log('Did RPC setup ', methodName);
          this.webSocketServer.register(
            methodName,
            (...args) => this.rpcCall(
              methodName,
              ...args,
            )
          );
        });
      },
    });

    return (superclass) => class extends superclass {
      constructor() {
        super();
        const { listen } = local(this);
        listen();
      }

      close() {
        this.webSocketServer.close();
      }
    }
  })(),

  client: (() => {
    const local = localFactory({
      isConnected: function() {
        return this.connected;
      },

      isAuthenticated: function() {
        return this.authenticated;
      },

      connect: function() {
        const { username, password } = this;
        this.log(`Attempting to connect to ${url}`);
        this.whileInitializing(new Promise((resolve, reject) => {
          this.webSocketClient = new WebSocketClient(url);
          this.webSocketClient
            .on('open', () => {
              this.connected = true;
              this.log('Connected');
              resolve();
            })
            .on('close', () => this.connected = false)
            .on('error', (data) => this.log.bind(this, data))
          ;
        }));
      },
    });

    return (superclass) => class extends superclass {
      constructor(...args) {
        super(...args);
        const { connect } = local(this);
        this.connected = false;
        connect();
      }

      rpcCall(method, ...options) {
        const [newMethod, ...newOptions] = super.rpcCall(method, ...options);
        this.log('Calling RPC '+newMethod, newOptions);
        const promise = this.webSocketClient.call(
          newMethod,
          newOptions,
        );
        promise.catch(this.log.bind(this))
        return [newMethod, ...newOptions];
      }

      close() {
        this.webSocketClient.close();
      }
    }
  })(),
};
