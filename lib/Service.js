const EventEmitter = require("node:events");

class Service extends EventEmitter {
  constructor(database, name) {
    super();
    this.database = database;
    this.name = name;
  }
}

module.exports = Service;
