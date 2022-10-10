const Editionable = require("./Editionable");

class Entity extends Editionable {
  constructor(database, name, scheme) {
    super(database, name);
    this.scheme = scheme;
  }

  __buildTableSchema() {
    let tableSchema = "";
    for (const column in this.scheme) {
      tableSchema = tableSchema.concat(
        `${column} ${this.scheme[column].type},`
      );
    }

    tableSchema = tableSchema.replace(new RegExp(/,$/), "");
    return tableSchema;
  }

  async create() {
    const query = `
        CREATE TABLE "${this.name}" AS (
            ${this.__buildTableSchema()}
            Primary key()
        )
        `;
  }
}
