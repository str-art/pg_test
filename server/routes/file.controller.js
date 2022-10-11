const path = require("path");
const Controller = require(path.join(
  process.env.BASE_DIR,
  "lib",
  "Controller"
));

class FileController extends Controller {
  constructor(server, services) {
    super("file", server);
    this.services = services;

    this.use("get", ":idFile", this.checkFile);

    this.use("get", ":idFile", this.sendFile);
  }

  async checkFile(req) {
    const { idFile = null } = req.params;

    if (!idFile) {
      throw Error("Not Found: File doesnt exist");
    }

    const file = await this.services.FileService.getFile(idFile);

    if (!file) {
      throw Error("Not Found: File doesnt exist");
    }

    req.body.file = file;
  }

  sendFile(req, res) {
    res.isSent = true;
    const { file } = req.body;

    res.type(file.mimetype);
    res.send(file.data);
  }
}

module.exports = FileController;
