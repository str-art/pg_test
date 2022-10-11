const path = require("path");
const Entity = require(path.join(process.env.BASE_DIR, "lib", "Entity"));

class File extends Entity {
  constructor(database) {
    const name = "File";
    const scheme = {
      id: { type: "integer", isPK: true, default: `nextval('UUID')` },
      name: { type: "varchar(250)", nullable: false },
      extension: { type: "varchar(10)", nullable: false },
      path: { type: "varchar(250)", nullable: false },
      ref: { type: "integer", nullable: false },
    };
    super(database, name, scheme);
  }
}

module.exports = File;
