const Event = require('./Event');
const {
  EVENT_TYPE_ADD,
} = require('../../../constants');

class EventAdd extends Event {
  constructor(payload) {
    super(payload);
    this.type = EVENT_TYPE_ADD;
  }
}

module.exports = EventAdd;
