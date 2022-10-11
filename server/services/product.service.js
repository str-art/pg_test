const path = require("path");
const Service = require(path.join(process.env.BASE_DIR, "lib", "Service"));

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

  async delete(idProduct) {
    if (!idProduct) {
      throw Error("Id is not defined");
    }

    await this.database.entities.Product.delete({ id: idProduct });

    await App.emit("deleteFiles", idProduct);
  }

  async update(idProduct, updates) {
    if (!idProduct) {
      throw Error("Id is not defiened");
    }
    return this.database.entities.Product.update({ id: idProduct }, updates);
  }

  async getProduct(selector = {}) {
    return this.database.entities.Product.select(selector);
  }
}

module.exports = ProductService;
