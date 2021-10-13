const { localFactory } = require('../util');
const { sha256 } = require('hash.js');

module.exports = {
  server: (() => {
    const local = localFactory({
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
      },

      authSetup: function() {
        const { authenticate } = local(this);
        if (!this.webSocketServer) {
          return false;
          throw new Error('WebSocketAuthentication requires WebSocket first');
        }
        this.tokens = {};
        this.webSocketServer.setAuth(authenticate);
      },
    });

    return (superclass) => class extends superclass {
      constructor(...args) {
        super(...args);
        const { authSetup } = local(this);
        authSetup();
      }

      rpcCall(method, ...args) {

      }
    };
  })(),

  client: (() => {
    const local = localFactory({
      isAuthenticated: function() {
        return this.authenticated;
      },

      login: function() {
        const { username, password } = this;
        return new Promise((resolve, reject) => {
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
        });
      },

      authSetup: function() {
        const { login } = local(this);
        const { username, password } = this;
        this.token = sha256().update(username+password).digest('hex');
        this.authenticated = false;
        if (this.webSocketClient) {
          this.webSocketClient.once('open', login);
        } else {
          return false;
          throw new Error('WebSocketAuthentication requires WebSocket');
        }
      }
    });

    return (superclass) => class extends superclass {
      constructor(...args) {
        super(...args);
        const { authSetup } = local(this);
        authSetup();
      }
    }
  })(),
};
