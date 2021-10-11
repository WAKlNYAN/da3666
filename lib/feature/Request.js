module.exports = {
  server: (() => {
    function local(that) {
      return {};
    };

    return (superclass) => class extends superclass {}
  })(),

  client: (() => {
    function local(that) {
      return {};
    };

    return (superclass) => class extends superclass {}
  })(),
};
