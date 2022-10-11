const QueryBuilder = require("./Query-Builder");

class Selectable extends QueryBuilder {
  constructor(database) {
    super(database);
    this.limit = 10;
  }

  async paginate(sql, binds = {}, page = 1) {
    const paginatedList = await this.query(
      `
        WITH data AS(
            ${sql}
        ),
        rows AS (
            SELECT
                COUNT(*) "rows"
            FROM
                data
        ),
        pages AS (
            SELECT
                CEIL(
                  CAST(R."rows" AS DECIMAL(7,2)) / CAST(${
                    this.limit
                  } AS DECIMAL(7,2))) "pages"
            FROM
                rows R
        )
        SELECT
                D.*,
                P.*
        FROM data D, pages P
        LIMIT ${this.limit}
        OFFSET ${(page - 1) * this.limit}  
        `,
      binds
    );

    const result = paginatedList.reduce(
      (list, row) => {
        const { pages, ...rest } = row;
        list.rows.push(rest);
        list.total = pages;
        return list;
      },
      { page, rows: [], total: 0 }
    );
    return result;
  }

  async select(selector = {}) {
    const isSelectorEmpty = Object.keys(selector).length === 0;
    const sql = `
    SELECT
        *
    FROM
        "${this.name}"
    ${isSelectorEmpty ? "" : this.__buildWhereClause(selector)}
    `;

    let result = await this.query(sql, selector);
    if (result.length === 1) {
      result = result[0];
    }

    if (result.length === 0) {
      result = null;
    }
    return result;
  }
}

module.exports = Selectable;
