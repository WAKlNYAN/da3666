const {
  EVENT_TYPE_ANY,
} = require('../../../constants');

class Event {
  constructor(payload) {
    this.date = new Date();
    this.type = EVENT_TYPE_ANY;
    this.sourceId = 0;
    this.payload = payload;
  }
}

module.exports = Event;
