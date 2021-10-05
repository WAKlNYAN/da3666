const Store = require('./Store.js');
const {
  EVENT_TYPE_ANY,
  EVENT_TYPE_ADD,
  EVENT_TYPE_DELETE,
  EVENT_TYPE_MUTATE,

  ENTITY_TYPE_USER,
} = require('../constants');
const eventClasses = require('./model/events');
const entityClasses = require('./model/entities');

const {
  add,
  user,
} = require('./util');
const store = new Store();
const please = store.processEvent.bind(store);
var options;

function setOptions(o) {
  options = o;
}

function makeEvent(eventType, entityType, payload) {
  const entity = new entityClasses[entityType](payload);
  return new eventClasses[eventType](entity);
}

function addUser(username) {
  dothis(() => {
    please(
      makeEvent(EVENT_TYPE_ADD, ENTITY_TYPE_USER, username)
    )
  });
}

function dothis(payload) {
  store.loadEventsFromFile(options.db)
    .catch(() => {
      console.error('Creating a new db file');
    })
    .finally(() => {
      console.log(payload());

      console.log(store.entities)

      store.saveEventsToFile(options.db).then(() => {
        console.log('Saved');
      });
    });
}

module.exports = {
  makeEvent,
  setOptions,
  addUser
};
