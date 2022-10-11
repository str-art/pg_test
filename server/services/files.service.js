const path = require("path");
const Service = require(path.join(process.env.BASE_DIR, "lib", "Service"));
const fs = require("node:fs/promises");

class FileService extends Service {
  constructor(database) {
    super(database, "FileService");

    App.on("deleteFiles", this.deleteEntityFiles.bind(this));
  }

  async uploadFiles(idEntity, files) {
    if (!Array.isArray(files)) {
      files = [files];
    }

    for (const file of files) {
      const { originalname: name, mimetype: extension, buffer: data } = file;
      const id = await this.database.getNextUUID();
      const __path = path.join(process.env.BASE_DIR, "data", id);
      await fs.writeFile(__path, data);
      await this.database.entities.File.insert({
        id,
        name,
        extension,
        ref: idEntity,
        path: __path,
      });
    }
  }

  async deleteEntityFiles(idEntity) {
    let files = await this.database.entities.File.select({ ref: idEntity });
    if (!files) return;
    if (!Array.isArray(files)) {
      files = [files];
    }

    for (const { path: __path, id } of files) {
      try {
        await fs.rm(__path);
        await this.database.entities.File.delete({ id });
      } catch (error) {
        console.error(error);
      }
    }
  }

  async getFile(idFile) {
    const file = await this.database.entities.File.select({ id: idFile });

    if (!file) {
      return null;
    }

    const { path: __path, extension: mimetype, name } = file;

    const data = await fs.readFile(__path);

    return { mimetype, name, data };
  }

  async getFileIds(idEntity) {
    const files = await this.database.entities.File.select({ ref: idEntity });
    return files.map(({ id }) => id);
  }
}

module.exports = FileService;
