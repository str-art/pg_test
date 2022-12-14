const path = require("path");
const EventEmitter = require("node:events");
const Express = require("express");
const Database = require(path.join(__dirname, "Database"));
const DirLoader = require(path.join(__dirname, "DirLoader"));
const ErrorHandler = require(path.join(__dirname, "ErrorHandler"));

class App extends EventEmitter {
  database;

  routes = [];

  server = Express();

  config;

  constructor(config) {
    super();
    this.config = config;
    this.dirLoader = new DirLoader();
    this.ErrorHandler = new ErrorHandler();

    global.App = this;
  }

  async connectToDB() {
    this.database = await new Database(this.config.database).connect();
    this.database.entities = {};

    const entitiesPath = path.join(process.env.BASE_DIR, "server", "entities");

    let __entities = await this.dirLoader.loadDir(entitiesPath);

    for (const constructor of __entities) {
      if (typeof constructor !== "function") {
        continue;
      }
      const entitiy = new constructor(this.database);
      this.database.entities[entitiy.name] = entitiy;
    }
  }

  async start() {
    await this.__loadDtos();

    await this.__loadServices();

    await this.__loadRoutes();

    process.nextTick(() => {
      this.server.use(this.ErrorHandler.notFound);

      this.server.use(this.ErrorHandler.handleError);

      this.server.listen(this.config.server.port, (err) => {
        if (err) {
          console.error(err);
          return cleanUpExit();
        }
        console.log(`Server started on port ${this.config.server.port}`);
      });
    });
  }

  async __loadDtos() {
    const dtoPath = path.join(process.env.BASE_DIR, "server", "dtos");

    const dtos = await this.dirLoader.loadDir(dtoPath);

    this.dtos = {};

    for (const constructor of dtos) {
      if (typeof constructor !== "function") {
        continue;
      }
      const dto = new constructor();
      this.dtos[dto.name] = dto;
    }
  }

  async __loadRoutes() {
    this.server.use(Express.json());

    const controllersPath = path.join(
      process.env.BASE_DIR,
      "server",
      "controllers"
    );

    const controllers = await this.dirLoader.loadDir(controllersPath);

    for (const controller of controllers) {
      new controller(this.server, this.services, this.dtos);
    }
  }

  async __loadServices() {
    this.services = {};

    const servicePath = path.join(process.env.BASE_DIR, "server", "services");

    const services = await this.dirLoader.loadDir(servicePath);

    for (const constructor of services) {
      if (typeof constructor !== "function") {
        continue;
      }
      const service = new constructor(this.database);

      this.services[service.name] = service;
    }
  }
}

module.exports = App;
