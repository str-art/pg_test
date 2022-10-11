const path = require("path");
const Dto = require(path.join(process.env.BASE_DIR, "lib", "Dto"));

class ProductDto extends Dto {
  constructor() {
    const scheme = {
      name: { type: "STRING", required: true },
      price: { type: "NUMBER", required: true },
      quantity: { type: "NUMBER", defaultVal: 0 },
    };
    const name = "ProductDto";

    super(scheme, name);
  }
}

module.exports = ProductDto;
