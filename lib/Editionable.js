const Selectable = require("./Selectable");

class Editionable extends Selectable {
  constructor(database, name, scheme) {
    super(database);
    this.name = name;
    this.scheme = scheme;
  }

  async insert(scheme = {}) {
    if (typeof scheme !== "object" || Object.keys(scheme).length === 0) {
      throw Error(`Cannot insert into ${this.name}. Data is invalid `);
    }

    const keys = Object.keys(scheme);

    const query = `
        INSERT INTO "${this.name}" (${this.addKeys(
      keys
    )}) VALUES(${this.addBinds(keys)}) RETURNING ${this.addKeys(
      Object.keys(this.scheme)
    )}
        `;
    const result = await this.database.query(query, Object.values(scheme));
    return result[0];
  }

  addBinds(keys) {
    let binds = "";
    for (let i = 1; i <= keys.length; i++) {
      binds = binds.concat(`$${i},`);
    }
    binds = binds.replace(new RegExp(/,$/), "");

    return binds;
  }

  addKeys(keys) {
    let aliases = "";
    for (const field of keys) {
      aliases = aliases.concat(`"${field}",`);
    }

    aliases = aliases.replace(new RegExp(/,$/), "");
    return aliases;
  }
}

module.exports = Editionable;
