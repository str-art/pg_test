class Selectable {
  constructor(database) {
    this.database = database;
    this.limit = 50;
  }

  async paginate(sql, binds = [], page = 1) {
    const paginatedList = await this.database.query(
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
}

module.exports = Selectable;
