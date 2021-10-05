const {
  EVENT_TYPE_ANY,
  EVENT_TYPE_ADD,
  EVENT_TYPE_DELETE,
  EVENT_TYPE_MUTATE,
} = require('../../constants');
const EventAdd = require('./event/Add');
const EventDelete = require('./event/Delete');
const EventMutate = require('./event/Mutate');
const Event = require('./event/Event');

module.exports = {
  [EVENT_TYPE_ADD]: EventAdd,
  [EVENT_TYPE_DELETE]: EventDelete,
  [EVENT_TYPE_MUTATE]: EventMutate,
  [EVENT_TYPE_ANY]: Event,
};
