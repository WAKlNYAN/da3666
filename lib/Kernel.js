const Class = require('./Class');

class Kernel extends Class {
  initialize() {
    return Promise.all(this._initPromises || []);
  }

  whileInitializing(waitForThis) {
    this._initPromises = [
      ...(this._initPromises || []),
      waitForThis,
    ];
  }

  rpcCall(method, ...args) {
    return Promise.resolve('Missing override rpcCall()');
  }

  rpcRegister(rpcMethods) {
    this._rpcMethods = [
      ...(this._rpcMethods || []),
      ...rpcMethods,
    ];
  }

  rpcList() {
    return this._rpcMethods || [];
  }
}

module.exports = Kernel;
