const Entity = require('./Entity.js');

class EntityUser extends Entity {
  constructor(userName) {
    super(userName);
    this.userName = userName;
  }

  isValid() { return !!this.userName; };
};

module.exports = EntityUser;
