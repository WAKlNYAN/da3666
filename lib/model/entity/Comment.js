const {
  ENTITY_TYPE_COMMENT,
} = require('../../../constants');
const Entity = require('./Entity.js');

class EntityComment extends Entity {
  constructor({ text, parentId }) {
    super(text);
    this.text = text;
    this.type = ENTITY_TYPE_COMMENT;
    this.parentId = parentId;
  }

  isValid() {
    return (
      !!this.text &&
      (
        this.parentId === 0 ||
        this.parentId > 0
      )
    );
  };
};

module.exports = EntityComment;
