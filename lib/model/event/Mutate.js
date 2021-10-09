const Event = require('./Event');
const {
  EVENT_TYPE_MUTATE,
} = require('../../../constants');
const { getEntityById } = require('../../da3000');

class EventMutate extends Event {
  constructor(payload) {
    super(payload);
    this.type = EVENT_TYPE_MUTATE;

    const {
      id
    } = payload;
    if (id !== 0 && id < 1) {
      throw new Error('Cannot mutate without ID');
    }
    this.oldEntity = getEntityById(id);
  }
}

module.exports = EventMutate;
