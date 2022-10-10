const Selectable = require("./Selectable");

class Editionable extends Selectable {
  constructor(database, name) {
    super(database);
    this.name = name;
  }

  async insert(scheme = {}) {
    if (typeof scheme !== "object" || Object.keys(scheme).length === 0) {
      throw Error(`Cannot insert into ${this.name}. Data is invalid `);
    }

    const keys = Object.keys(scheme);

    const addBinds = () => {
      let binds = "";
      for (let i = 1; i <= keys.length; i++) {
        binds = binds.concat(`$${i},`);
      }
      binds = binds.replace(new RegExp(/,$/), "");

      return binds;
    };

    const addKeys = (Alias) => {
      let aliases = "";
      for (const field of keys) {
        aliases = aliases.concat(`${Alias}."${field}",`);
      }

      aliases = aliases.replace(new RegExp(/,$/), "");
      return aliases;
    };

    const query = `
        INSERT INTO "${this.name}" E (${addKeys("E")}) VALUES(${addBinds()})
        `;
    const result = await this.database.query(query, Object.values(scheme));
    return result;
  }
}

module.exports = Editionable;
