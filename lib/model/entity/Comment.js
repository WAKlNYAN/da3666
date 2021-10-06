const Entity = require('./Entity.js');

class EntityComment extends Entity {
  constructor({ text, parentId }) {
    super(text);
    this.text = text;
    this.parentId = parentId;
  }

  isValid() {
    return (
      !!this.comment &&
      (
        this.parentId === 0 ||
        this.parentId > 0
      )
    );
  };
};

module.exports = EntityComment;
