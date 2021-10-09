const Store = require('./Store.js');
const store = new Store();
var options;

function setOptions(o) {
  options = o;
}

const getEntityById = store.getEntityById.bind(store);

function mockHTTP(payload) {
  if (typeof(payload) !== 'string') {
    throw new Error('Payload must be stringified JSON but is, instead, type of ' + typeof payload);
  }
  const injectEvent = () => store.processEvent(JSON.parse(payload));

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
  mockHTTP,
  getEntityById,
  store,
};
