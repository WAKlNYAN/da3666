const Entity = require('./Entity.js');

class EntityUser extends Entity {
  constructor(options) {
    super(options);
    const { userName, password } = options;
    this.userName = userName;
    this.password = password;
  }

  isValid() { return !!this.userName; };
};

module.exports = EntityUser;
