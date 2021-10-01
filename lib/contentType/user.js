const Content = require('./base.js');

class User extends Content {
  constructor(userName) {
    super();
    console.log(`New user ${userName}`);
    this.userName = userName;
  }

  isValid() { return !!this.userName; };
  contentType() { return super.contentType()+'/User'; };
};

module.exports = User;
