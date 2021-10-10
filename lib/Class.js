class Class {
  constructor() {
    this._importAuxMethods();
  }

  log() {
    const {
      _showDebug: visible,
      _className: className,
    } = Object.getPrototypeOf(this);
    if (visible) {
      console.log.apply(console, [
        `D³${className}:`,
        ...arguments,
      ]);
    }
  }

  _importAuxMethods() {
    const { _auxMethods: auxMethods } = Object.getPrototypeOf(this);
    if (auxMethods) {
      Object.keys(auxMethods).forEach(method => {
        this[method] = auxMethods[method].bind(this);
      });
    }
  }
}
Object.assign(Class.prototype, {
  _className: 'Class',
  _showDebug: false,
  _auxMethods: undefined,
});

module.exports = Class;
