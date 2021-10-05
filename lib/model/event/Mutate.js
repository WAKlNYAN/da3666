const Event = require('./Event');
const {
  EVENT_TYPE_MUTATE,
} = require('../../../constants');

class EventMutate extends Event {
  constructor(payload) {
    super(payload);
    this.type = EVENT_TYPE_MUTATE;
  }
}

module.exports = EventMutate;
