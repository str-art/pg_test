const path = require("path");
const EventEmitter = require("node:events");
const Express = require("express");
const Database = require(path.join(__dirname, "Database"));

class App extends EventEmitter {
  database;

  routes = [];

  server = Express();

  config;

  constructor(config) {
    super();
    this.config = config;
  }

  async connectToDB() {
    this.database = await new Database(this.config.database).connect();
  }
}

module.exports = App;
