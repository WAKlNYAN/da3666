const WebSocketServer = require('rpc-websockets').Server;
const WebSocketClient = require('rpc-websockets').Client;
const Class = require('../Class');
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

class Request extends Class {
  constructor(options) {
    super(options);
    const {
      token
    } = options;
    this.token = token;
  }

  set token(token) {
    if (token !== 1) {
      throw new Error('Bad token');
    }
    this._token = token;
  }

  get token() {
    return this._token;
  }
}

module.exports = {
  server: (() => {
    const local = localFactory({
      listen: function() {
        const {
          registerRPCMethods,
        } = local(this);
        return new Promise((resolve, reject) => {
          this.webSocketServer = new WebSocketServer({
            port,
            host: address,
          });
          this.webSocketServer.on('listening', () => {
            this.log('Listening');
            resolve();
          });
          registerRPCMethods();
        });
      },

      registerRPCMethods: function() {
        const rpcMethods = this.getRPCMethods();
        const { control } = local(this);
        Object.keys(rpcMethods).forEach(methodName => {
          this.webSocketServer.register(
            methodName,
            (...args) => control(
              rpcMethods[methodName],
              methodName,
              ...args,
            )
          );
        });
      },

      control(method, methodName, options, code) {
        try {
          this.log('Executing RPC '+methodName, options);
          return method(...options);
        } catch(e) {
          this.log(e);
          return Promise.reject(e);
        }
      },

      createRequest: function(method, token, ...args) {
        return new Request({
          method,
          token,
          args,
        });
      },
    });

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

      getRPCMethods() {
        const { addEntity, getEntityById } = this;
        return {
          ...super.getRPCMethods(),
          'addEntity': addEntity,
          'getEntityById': getEntityById,
        };
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
        return new Promise((resolve, reject) => {
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
        });
      },
    });

    return (superclass) => class extends superclass {
      constructor(...args) {
        super(...args);
        const { connect } = local(this);
        this.connected = false;
        this.initializePromise = connect();
      }

      close() {
        this.webSocketClient.close();
      }

      initialize() {
        return this.initializePromise;
      }

      call(method, ...options) {
        const {
          isConnected,
        } = local(this);
        if (isConnected()) {
          this.log('Calling RPC '+method, options);
          const promise = this.webSocketClient.call(
            method,
            options,
          );
          promise.catch(this.log.bind(this))
          return promise;
        } else {
          throw new Error('Not connected');
        }
      }

      control(method, methodName, ...args) {
        return method(...args);
      }

      rpcMethods() {
        const rpcMethods = this.getRPCMethods();
        return Object.keys(rpcMethods).reduce((methods, method) => ({
          ...methods,
          [method]: (...args) => this.control(rpcMethods[method], method, ...args)
        }));
      }

      getRPCMethods() {
        return {
          ...super.getRPCMethods(),
          'getEntityById': this.call.bind(this, 'getEntityById'),
          'addEntity': this.call.bind(this, 'addEntity'),
        };
      }
    }
  })(),
};
