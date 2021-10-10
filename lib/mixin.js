const { mix } = require('mixwith');
const namespacePrefix = '_mixin_';

const namespace = (namespaceString) => {
  const ns = that => that
    ? that[ns()]()
    : namespacePrefix + namespaceString;
  return ns;
};

module.exports = {
  mix,
  namespace,
}
