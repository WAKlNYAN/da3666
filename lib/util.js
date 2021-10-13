module.exports = {
  localFactory: (data) => (that) => Object.keys(data).reduce(
    (methods, method) => ({
      ...methods,
      [method]: data[method].bind(that)
    }), {}
  ),

  setRPCMethods: (methodNames) => (that) => {
    that.rpcRegister(methodNames);
  },

  setRPCMethods2: (methodPairs) => (that) => {
    const { _className: className } = Object.getPrototypeOf(that);
    const methodNames = Object.keys(methodPairs);
    that.rpcRegister(methodNames);

    if (className === 'Server') {
      // Monkeypatch
      that.log('Monkeypatching rpcCall()');
      const rpcCall = that.rpcCall.bind(that);
      that.rpcCall = function(method, ...args) {
        if (methodNames.indexOf(method) !== -1) {
          return methodPairs[method].apply(that, ...args);
        }
        return rpcCall(method, ...args);
      }.bind(that);
    }
  }
};
