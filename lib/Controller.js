const multer = require("multer");

class Controller {
  constructor(prefix, server) {
    this.__server = server;
    this.__prefix = `api/${prefix}`;
    this.__routes = [];
    this.__middlewares = [];
    this.__upload = [];
    this.__statusMap = {
      get: 200,
      post: 201,
      put: 200,
      patch: 200,
      delete: 204,
    };
    process.nextTick(() => {
      this.__register();
    });
  }

  on(method, path, handler) {
    this.__routes.push({ method, path, handler: handler.bind(this) });
  }

  use(method, path, handler) {
    this.__middlewares.push({ method, path, handler: handler.bind(this) });
  }

  __register() {
    for (const { method, path, fields, settings } of this.__upload) {
      this.__server[method](
        this.__buildUrl(path),
        multer(settings).fields(fields)
      );
    }

    for (const { method, path, handler } of this.__middlewares) {
      this.__server[method](
        this.__buildUrl(path),
        this.__middlewareTemplate.bind({ handler })
      );
    }

    for (const { method, path, handler } of this.__routes) {
      this.__server[method](
        this.__buildUrl(path),
        this.__handlerTemplate.bind({
          handler,
          status: this.__statusMap[method],
        })
      );
    }
  }

  __buildUrl(path) {
    return `/${this.__prefix}/${path}`;
  }

  upload(method, path, fields = [{ name: "file" }], settings = {}) {
    this.__upload.push({ method, path, fields, settings });
  }

  async __handlerTemplate(req, res, next) {
    const { body, query, files = null, file = null } = req;
    try {
      const result = await this.handler({ body, query, files, file });
      res.status(this.status);
      res.send(result);
    } catch (err) {
      next(err);
    }
  }

  async __middlewareTemplate(req, res, next) {
    try {
      await this.handler(req, res);
      if (!res.isSent) {
        next();
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
