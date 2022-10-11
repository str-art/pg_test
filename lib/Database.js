const EventEmitter = require("node:events");
const { Pool } = require("pg");

class Database extends EventEmitter {
  config = {
    host: null,
    port: null,
    user: null,
    password: null,
    database: null,
  };
  pool;

  constructor(config) {
    super();

    this.setConfig(config);
    this.connect();
    this.__startUUIDSequence();
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
    return this;
  }

  async query(...args) {
    const client = await this.pool.connect();
    try {
      const { rows } = await client.query(...args);
      return rows;
    } catch (error) {
      console.debug(...args);
      console.error(error);
    }
    client.release();
  }

  async __startUUIDSequence() {
    try {
      await this.query(
        `
        CREATE SEQUENCE IF NOT EXISTS UUID START 1
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
