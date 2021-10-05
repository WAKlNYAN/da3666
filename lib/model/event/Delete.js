const Event = require('./Event');
const {
  EVENT_TYPE_DELETE,
} = require('../../../constants');

class EventDelete extends Event {
  constructor(payload) {
    super(payload);
    this.type = EVENT_TYPE_DELETE;
  }
}

module.exports = EventDelete;
