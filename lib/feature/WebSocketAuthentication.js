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
    });

    return (superclass) => class extends superclass {
      constructor(...args) {
        super(...args);
        const { authenticate } = local(this);
        this.webSocketServer.setAuth(authenticate);
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
    });

    return (superclass) => class extends superclass {
      constructor(...args) {
        super(...args);
        const { login } = local(this);
        const { username, password } = this;
        this.token = sha256().update(username+password).digest('hex');
        this.authenticated = false;
        this.webSocketClient.once('open', login);
      }
    }
  })(),
};
