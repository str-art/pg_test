class QueryBuilder {
  constructor(database) {
    this.database = database;
  }

  async query(sql, binds) {
    const { sql: __sql, binds: __binds } = this.__processBinds(sql, binds);
    return this.database.query(__sql, __binds);
  }

  __processBinds(sql, binds) {
    let bindsArray = [];

    const entries = Object.entries(binds);

    let i = 1;

    for (i; i <= entries.length; i++) {
      const index = i - 1;

      const [column, value] = entries[index];

      const bindsName = `:${column}`;

      if (Array.isArray(value)) {
        sql = sql.replace(bindsName, `($${i})`);
        bindsArray.push(value);
        continue;
      }

      if (typeof binds[column] === "object") {
        throw Error("Invalid binds. Cant bind object fields");
      }

      bindsArray.push(value);

      sql = sql.replace(bindsName, `$${i}`);
    }

    console.log(bindsArray);

    return { sql, binds: bindsArray };
  }

  __buildWhereClause(selector = {}, alias = "") {
    let whereClause = "WHERE ";
    const entries = Object.entries(selector);

    for (let i = 1; i <= entries.length; i++) {
      const index = i - 1;

      const [column] = entries[index];

      whereClause = whereClause.concat(
        ` ${alias ? alias + "." : ""}"${column}" = :${column} AND`
      );
    }

    whereClause = whereClause.replace(new RegExp(/AND$/), "");

    return whereClause;
  }
}

module.exports = QueryBuilder;
