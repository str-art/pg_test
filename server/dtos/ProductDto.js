const Dto = require("../../lib/Dto");

class ProductDto extends Dto {
  constructor() {
    const scheme = {
      price: { type: "NUMBER", required: true },
      quantity: { type: "NUMBER", defaultVal: 0 },
    };
    const name = "ProductDto";

    super(scheme, name);
  }
}

module.exports = ProductDto;
