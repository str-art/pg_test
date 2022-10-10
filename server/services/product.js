const Service = require("../../lib/Service");

class ProductService extends Service {
  constructor(database) {
    super(database, "ProductService");
  }

  async create(product) {
    return await this.database.entities.Product.insert(product);
  }

  async getList(page = 1) {
    return await this.database.entities.Product.paginate(
      `
      SELECT
          P.*
      FROM
          "Product" P
      `,
      [],
      page
    );
  }

  async delete() {}

  async update() {}

  async addImage() {}

  async getImages() {}
}

module.exports = ProductService;
