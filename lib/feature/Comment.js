const { localFactory, setRPCMethods } = require('../util');

const rpcSetup = setRPCMethods([
  'addCommentToEntity'
]);

module.exports = {
  server: (() => {
    const local = localFactory({
      test: function() {
        return 'testy ' + Object.keys(this.getRPCMethods())[0];
      },

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
      },
    });

    return (superclass) => class extends superclass {
      constructor(...args) {
        super(...args);
        rpcSetup(this);
      }

      rpcCall(method, ...args) {
        const { addCommentToEntity } = local(this);
        if (method === 'addCommentToEntity') {
          return addCommentToEntity(...args);
        }
        return super.rpcCall(method, ...args);
      }
    };
  })(),

  client: (() => {
    const local = localFactory({
      addCommentToEntity: function(...args) {
        const [ originalEntity, commentEntity ] = args;
        if (originalEntity && commentEntity) {
          return this.call('addCommentToEntity', ...args);
        } else {
          console.log(arguments);
          throw new Error('Cannot validate comment');
          return false;
        }
      },
    });

    return (superclass) => class extends superclass {
      constructor(...args) {
        super(...args);
        rpcSetup(this);
      }
    };
  })(),
};
