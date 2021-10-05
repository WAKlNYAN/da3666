const Entity = require('./view/entity/Entity.js');
const fs = require('fs');
const {
  EVENT_TYPE_ADD,
  EVENT_TYPE_DELETE,
  EVENT_TYPE_MUTATE,

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
    const { sourceId, type, date, payload } = event;
    const { id } = payload;

    this.events.push(event);

    var affectedEntity = {
      type: ENTITY_TYPE_ENTITY,
    };

    switch(type) {
      case EVENT_TYPE_MUTATE:
        var oldEntity = this.getEntityById(MUTATE.id).entity;
        affectedEntity = {
          ...affectedEntity,
          ...oldEntity,
          ...payload,
          sources: [...(oldEntity.sources || []), sourceId],
          date: {
            ...oldEntity.date,
            modified: date,
          },
        };

        this.entities = [...this.entities.filter((entity) => entity.id !== id), affectedEntity];
      break;
      case EVENT_TYPE_ADD:
        affectedEntity = {
          ...affectedEntity,
          ...payload,
          sources: [sourceId],
          id: this.entityIdMax++,
          date: {
            created: date,
          },
        };
        this.entities.push(affectedEntity);
      break;
      case EVENT_TYPE_DELETE:
        this.entities = [...this.entities.filter((entity) => entity.id !== id)];
        affectedEntity = undefined;
      break;
      default:
        console.warn('Unable to process event ', event);
        return false;
      break;
    }

    return {
      success: true,
      affectedEntity,
    };
  }
}

module.exports = Store;
