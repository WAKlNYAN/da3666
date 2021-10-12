module.exports = {
  localFactory: (data) => (that) => Object.keys(data).reduce(
    (methods, method) => ({
      ...methods,
      [method]: data[method].bind(that)
    }), {}
  )
};
