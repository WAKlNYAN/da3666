module.exports = {
  server: (() => {
    function local(that) {
      return {
        test: function() {
          return 'testy ' + Object.keys(this.getRPCMethods())[0];
        }.bind(that),

        addCommentToEntity: function({
          token,
          originalEntity,
          commentEntity,
        }) {
          const { test } = local(this);
          const { userId } = this.getUserByToken({ token });
          const { id: originalEntityId } = originalEntity;
          const originalEntityObj = this.store.getEntityById(userId, originalEntityId);
          if (originalEntityObj) {
            return this.store.addEntity(userId, {
              ...commentEntity,
              parentId: originalEntity.id,
              comment: 'addCommentToEntity ' + test(),
            });
          } else {
            throw new Error('Original entity does not exist'+originalEntityId + JSON.stringify(originalEntityObj));
          }
        }.bind(that),
      }
    }

    return (superclass) => class extends superclass {
      getRPCMethods() {
        const { addCommentToEntity } = local(this);
        return {
          ...super.getRPCMethods(),
          'addCommentToEntity': addCommentToEntity,
        };
      }
    };
  })(),

  client: (() => {
    function local(that) {
      return {
        addCommentToEntity: function(options) {
          const { originalEntity, commentEntity } = options;
          if (originalEntity && commentEntity) {
            return this.call('addCommentToEntity', options);
          } else {
            console.log(options);
            throw new Error('Cannot validate comment');
            return false;
          }
        }.bind(that),
      };
    };

    return (superclass) => class extends superclass {
      getRPCMethods() {
        const { addCommentToEntity } = local(this);
        return {
          ...super.getRPCMethods(),
          'addCommentToEntity': addCommentToEntity,
        };
      }
    };
  })(),
};
