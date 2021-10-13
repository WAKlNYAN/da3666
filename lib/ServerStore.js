const Kernel = require('./Kernel');
const fs = require('fs');
const {
  debug: {
    any: debugAny,
    serverStore: debug
  },
  db,
} = require('../config');

class ServerStore extends Kernel {
  constructor() {
    super();
    this.file = db;
    this.entityId = 0;
    this.entities = [];
    this.initialized = false;
    this.whileInitializing(this.firstLoad());
  }

  firstLoad() {
    return new Promise((resolve, reject) => {
      this.loadDB().then(() => {
        this.initialized = true;
        resolve();
      }).catch(err => {
        this.log(err);
      });
    });
  }

  getEntityById(userId, entityId) {
    const entity = this.entities.find(({ id }) => id === entityId);
    return entity;
  }

  addEntity(userId, entity) {
    return new Promise((resolve, reject) => {
      const newEntity = {
        ...entity,
        userId,
        date: {
          created: new Date()
        },
        id: this.getNewEntityId(),
      };
      this.entities.push(newEntity);
      this.saveDB().then(() => resolve(newEntity));
    });
  }

  getNewEntityId() {
    return this.entityId+1;
  }

  loadDB() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.file, 'utf8', (err, data) => {
        if (err) {
          this.log('Cant read file');
          reject();
        } else {
          try {
            this.entities = JSON.parse(data);
						this.entityId = this.entities.reduce(
							(highestId, entity) => (
                parseInt(entity.id) > highestId
                  ? parseInt(entity.id)
                  : highestId
              ),
							this.entityId
						);
            this.log(`Loaded ${this.entities.length} entities.`);
            resolve();
          } catch(e) {
            reject();
          }
        }
      });
    });
  }

  saveDB() {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.file, JSON.stringify(this.entities), 'utf8', (err) => {
        if (err) {
          this.log('Cant write file');
          reject();
        } else {
          resolve();
        }
      });
    });
  }
}
Object.assign(ServerStore.prototype, {
  _className: 'ServerStore',
  _showDebug: debug && debugAny,
});

module.exports = ServerStore;
