const path = require("path");
const { readdir } = require("node:fs/promises");

class DirLoader {
  async loadDir(dirName, recursive = false) {
    let functions = [];

    let files = await readdir(dirName, { withFileTypes: true });

    for (const { name, isDirectory } of files) {
      const __path = path.join(dirName, name);

      if (recursive && isDirectory()) {
        functions.push(this.loadDir(__path, recursive));
      } else {
        functions.push(require(__path));
      }
    }
    return functions;
  }
}

module.exports = DirLoader;
