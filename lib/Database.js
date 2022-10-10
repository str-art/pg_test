const EventEmitter = require("node:events");
const { Pool } = require("pg");

class Database extends EventEmitter {
  config = { host: null, port: null, user: null, password: null };
  pool;

  constructor(config) {
    super();

    this.setConfig(config);
    this.connect();
  }

  setConfig(config) {
    for (const field in this.config) {
      if (!config[field]) {
        throw Error(`Database ${field} is not defiend`);
      }

      this.config[field] = config[field];
    }
    Object.freeze(this.config);
  }

  connect() {
    this.pool = new Pool(this.config);
  }

  async query(...args) {
    const client = await this.pool.connect();
    const result = await client.query(...args).finally(() => client.release());
    return result;
  }

  async __startUUIDSequence() {
    try {
      await this.query(
        `
        CREATE SEQUENCE IF NOT EXIST UUID START 1
        `
      );
    } catch (err) {
      throw Error(`Failed to start uuid sequence: ${err.message}`);
    }
  }

  async getNextUUID() {
    const nextUUID = await this.query(
      `
      SELECT nextval('UUID')
      `
    );
    return nextUUID;
  }
}

module.exports = Database;
