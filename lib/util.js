const contentTypes = {
  base: require('./contentType/base.js'),
  user: require('./contentType/user.js'),
};

function add(content) {
  if (content.isValid()) {
    return {
      ...primitiveEvent(),
      sourceId: -1,
      ADD: content,
    };
  } else {
    return `Content not added`;
  }
}

function primitiveEvent() {
  return {
    date: new Date()
  };
}

function user(args) {
  return new contentTypes.user(args);
}

module.exports = {
  add,
  user,
  contentTypes,
};
