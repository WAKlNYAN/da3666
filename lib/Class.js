class Class {
  log() {
    const fgCyan = "\x1b[36m";
    const reset = "\x1b[0m";
    const {
      _showDebug: visible,
      _className: className,
    } = Object.getPrototypeOf(this);
    if (visible) {
      console.log.apply(console, [
        `${fgCyan}D³${className}${reset}:`,
        ...arguments,
      ]);
    }
  }
}
Object.assign(Class.prototype, {
  _className: 'Class',
  _showDebug: false,
});

module.exports = Class;
