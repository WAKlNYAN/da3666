const {
  ENTITY_TYPE_COMMENT,
} = require('../../../constants');
const Entity = require('../../model/entity/Entity');

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

const client = {
  addCommentToEntity: function(options) {
    const { originalEntity, commentEntity } = options;
    if (originalEntity && commentEntity) {
      return this.call('addCommentToEntity', options);
    } else {
      console.log(options);
      throw new Error('Cannot validate comment');
      return false;
    }
  }
};

const server = {
  addCommentToEntity: function({
    token,
    originalEntity,
    commentEntity,
  }) {
    const { userId } = this.getUserByToken({ token });
    const { id: originalEntityId } = originalEntity;
    const originalEntityObj = this.store.getEntityById(userId, originalEntityId);
    if (originalEntityObj) {
      return this.store.addEntity(userId, {
        ...commentEntity,
        parentId: originalEntity.id,
        comment: 'addCommentToEntity',
      });
    } else {
      throw new Error('Original entity does not exist'+originalEntityId + JSON.stringify(originalEntityObj));
    }
  }
};

module.exports = {
  server,
  client,
  entity: EntityComment,
};
