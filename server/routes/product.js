const Controller = require("../../lib/Controller");

class ProductController extends Controller {
  constructor(server, services, dtos) {
    super("products", server);

    this.services = services;

    this.dtos = dtos;

    this.on("get", "list", this.getList);

    this.use("post", "/", this.checkProduct);

    this.on("post", "/", this.createProduct);
  }

  async getList({ query }) {
    return products;
  }

  async createProduct({ body }) {
    const { product } = body;
    const result = await this.services.ProductService.create(product);
    return result;
  }

  checkProduct(req, res) {
    req.body.product = this.dtos.ProductDto.validate(req.body);
  }
}

module.exports = ProductController;
