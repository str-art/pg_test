const path = require("path");
const Controller = require(path.join(
  process.env.BASE_DIR,
  "lib",
  "Controller"
));

class ProductController extends Controller {
  constructor(server, services, dtos) {
    super("products", server);

    this.services = services;

    this.dtos = dtos;

    this.use("get", "", this.checkPage);

    this.on("get", "", this.getList);

    this.use("post", "", this.checkDto);

    this.on("post", "", this.createProduct);

    this.use("get", ":idProduct", this.checkProductId);

    this.on("get", ":idProduct", this.getProduct);

    this.use("patch", ":idProduct", this.checkProductId);

    this.use("patch", ":idProduct", this.checkPartialDto);

    this.on("patch", ":idProduct", this.updateProduct);

    this.use("delete", ":idProduct", this.checkProductId);

    this.on("delete", ":idProduct", this.deleteProduct);

    this.use("post", ":idProduct/file", this.checkProductId);

    this.upload("post", ":idProduct/file", [{ name: "product", maxCount: 1 }]);

    this.on("post", ":idProduct/file", this.loadFile);

    this.use("get", ":idProduct/file/list", this.checkProductId);

    this.on("get", ":idProduct/file/list", this.getProductFiles);
  }

  checkPage(req) {
    const page = req.query.page;
    if (!page) {
      req.query.page = 1;
      return;
    }

    if (Number.isNaN(page)) {
      throw Error("Bad Request: Invalid number");
    }
  }

  checkDto(req) {
    req.body.product = this.dtos.ProductDto.validate(req.body);
  }

  async checkProductId(req) {
    const { idProduct = null } = req.params;

    if (!idProduct) {
      throw Error("Not Found: Invalid Product id");
    }

    const product = await this.services.ProductService.getProduct({
      id: idProduct,
    });
    if (!product) {
      throw Error("Not Found: Invalid Product id");
    }
    req.body.product = product;
  }

  checkPartialDto(req) {
    req.body.updates = this.dtos.ProductPartialDto.validate(req.body);
  }

  getProduct({ body }) {
    const { product } = body;
    return product;
  }

  async updateProduct({ body }) {
    const { updates, product } = body;

    const result = await this.services.ProductService.update(
      product.id,
      updates
    );
    return result;
  }

  async getList({ query }) {
    const { page } = query;
    return await this.services.ProductService.getList(page);
  }

  async createProduct({ body }) {
    const { product } = body;
    const result = await this.services.ProductService.create(product);
    return result;
  }

  async deleteProduct({ body }) {
    const { product } = body;
    await this.services.ProductService.delete(product.id);
  }

  async loadFile({ body, files }) {
    const { product } = body;

    await this.services.FileService.uploadFiles(product.id, files.product);
  }

  async getProductFiles({ body }) {
    const { product } = body;

    const files = await this.services.FileService.getFileIds(product.id);

    return files;
  }
}

module.exports = ProductController;
