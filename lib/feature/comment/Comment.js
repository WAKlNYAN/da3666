const {
  ENTITY_TYPE_COMMENT,
} = require('../../../constants');
const Entity = require('../../model/entity/Entity');
const { namespace } = require('../../mixin');
const ns = namespace(ENTITY_TYPE_COMMENT);

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

const serverMixin = (superclass) => class extends superclass {
  [ns()]() {
    return {
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
    }
  }

  getRPCMethods() {
    const { addCommentToEntity } = ns(this);
    return {
      ...super.getRPCMethods(),
      'addCommentToEntity': addCommentToEntity,
    };
  }
};

const clientMixin = (superclass) => class extends superclass {
  addCommentToEntity(options) {
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

module.exports = {
  server: serverMixin,
  client: clientMixin,
  entity: EntityComment,
};
