// Makes things sillier

module.exports = {
  server: (() => {
    function local(that) {
      return {};
    };

    return (superclass) => class extends superclass {
      getRPCMethods() {
        return {
          ...super.getRPCMethods(),
          beSilly: (...args) => 'beSilly('+JSON.stringify(args)+')',
        }
      }
    }
  })(),

  client: (() => {
    function local(that) {
      return {};
    };

    return (superclass) => class extends superclass {
      getRPCMethods() {
        return {
          ...super.getRPCMethods(),
          beSilly: this.call.bind(this, 'beSilly'),
        }
      }
    }
  })(),
};
