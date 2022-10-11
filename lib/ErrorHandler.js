class ErrorHandler {
  statuses = {
    "bad request": 400,
    unauthorized: 401,
    forbidden: 403,
    "not found": 404,
  };

  getStatus(errorName = "") {
    let code = this.statuses[errorName];
    if (!code) {
      code = 500;
    }
    return code;
  }

  handleError = this.__handleError.bind(this);

  notFound = this.__notFound.bind(this);

  __handleError(err, req, res, next) {
    const [errorName] = err.message.split(":");
    const code = this.getStatus(errorName.toLowerCase());
    res.status(code);
    const message = code >= 500 ? "Internal server error" : err.message;
    res.send({ code, message });
  }

  __notFound(req, res, next) {
    const error = new Error("Not Found: Url doesnt exist");
    next(error);
  }
}

module.exports = ErrorHandler;
