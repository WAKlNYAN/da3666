const Entity = require('./Entity.js');
const fs = require('fs');
const {
  ENTITY_TYPE_ENTITY
} = require('../constants');

class Store {
  constructor() {
    this.events = [];
    this.entities = [];
    this.entityIdMax = 0;
  }

  getEntity(selector) {
    return this.entityFactory(this.entities.find(selector));
  }

  getEntities(selector) {
    return this.entities.filter(selector).map((entity) => this.entityFactory(entity));
  }

  getEntityById(id) {
    if (!id && id !== 0) return false;
    return this.getEntity((entity) => entity.id === id);
  }

  entityFactory(entity) {
    if (!Entity) debugger;
    return new Entity(entity, this);
  }

  get viewModel() {
    return this.entities.map((entity) => this.entityFactory(entity).viewModel);
  }

  get viewModelTypes() {
    const viewModelTypes = {};
    this.entities.forEach((entity) => {
      const viewModel = this.entityFactory(entity).viewModel;
      viewModelTypes[viewModel.type] = [...(viewModelTypes[viewModel.type] || []), viewModel];
    });
    return viewModelTypes;
  }

  loadEventsFromFile(filename) {
    return new Promise((resolve, reject) => {
      fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
          console.error('Cant read file');
          reject();
        } else {
          try {
            const events = JSON.parse(data);
            this.processEvents(events);
            resolve();
          } catch(e) {
            reject();
          }
        }
      });
    });
  }

  saveEventsToFile(filename) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filename, JSON.stringify(this.events), 'utf8', (err) => {
        if (err) {
          console.error('Cant write file');
          reject();
        } else {
          resolve();
        }
      });
    });
  }

  processEvents(events) {
    events.forEach(event => this.processEvent(event));
  }

  processEvent(event) {
    const { ADD, MUTATE, DELETE, sourceId } = event;

    this.events.push(event);

    var affectedEntity = {
      type: ENTITY_TYPE_ENTITY,
    };

    if (ADD) {
      affectedEntity = {
        ...affectedEntity,
        ...ADD,
        sources: [sourceId],
        id: this.entityIdMax++,
        date: {
          created: new Date(),
        },
      };
      this.entities.push(affectedEntity);
    } else if (DELETE && DELETE.id !== undefined) {
      this.entities = [...this.entities.filter((entity) => entity.id !== DELETE.id)];
      affectedEntity = undefined;
    } else if (MUTATE && MUTATE.id !== undefined) {
      var oldEntity = this.getEntityById(MUTATE.id).entity;
      affectedEntity = {
        ...affectedEntity,
        ...oldEntity,
        ...MUTATE,
        sources: [...(oldEntity.sources || []), sourceId],
        date: {
          ...oldEntity.date,
          modified: new Date(),
        },
      };

      this.entities = [...this.entities.filter((entity) => entity.id !== MUTATE.id), affectedEntity];
    } else {
      console.warn('Unable to process event ', event);
      return false;
    }

    return {
      success: true,
      affectedEntity,
    };
  }
}

module.exports = Store;
