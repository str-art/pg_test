class Controller {
  constructor(prefix, server) {
    this.__server = server;
    this.__prefix = `api/${prefix}`;
    this.__routes = [];
    this.__middlewares = [];
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

  async __handlerTemplate(req, res, next) {
    const { body, query } = req;
    try {
      const result = await this.handler({ body, query });
      console.log(result);
      res.status(this.status);
      res.send(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  async __middlewareTemplate(req, res, next) {
    try {
      await this.handler(req, res);
      next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
}

module.exports = Controller;
