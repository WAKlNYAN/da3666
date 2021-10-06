const Store = require('./Store.js');
const {
  EVENT_TYPE_ANY,
  EVENT_TYPE_ADD,
  EVENT_TYPE_DELETE,
  EVENT_TYPE_MUTATE,

  ENTITY_TYPE_USER,
  ENTITY_TYPE_COMMENT,
} = require('../constants');
const eventClasses = require('./model/events');
const entityClasses = require('./model/entities');

const store = new Store();
var options;

function setOptions(o) {
  options = o;
}

function addUser(username) {
  return dothis(makeEvent(EVENT_TYPE_ADD, ENTITY_TYPE_USER, username));
}

function addComment(args) {
  return dothis(makeEvent(EVENT_TYPE_ADD, ENTITY_TYPE_COMMENT, args));
}

function makeEvent(eventType, entityType, payload) {
  const event = new eventClasses[eventType](
    new entityClasses[entityType](payload)
  );

  return event;
}

function dothis(payload) {
  const injectEvent = () => store.processEvent(payload);

  return new Promise((resolve, reject) => {
    if (options && options.db) {
      store.loadEventsFromFile(options.db)
        .catch(() => {
          console.error('Creating a new db file');
        })
        .finally(() => {
          const injectionReturn = injectEvent();

          store.saveEventsToFile(options.db).then(() => {
            console.log('Saved');
            resolve(injectionReturn);
          });
        });
    } else {
      resolve(injectEvent());
    }
  });
}

module.exports = {
  setOptions,
  addUser,
  addComment,
  store,
};
