const path = require("path");
const Dto = require(path.join(process.env.BASE_DIR, "lib", "Dto"));

class ProductPartialDto extends Dto {
  constructor() {
    const name = "ProductPartialDto";
    const scheme = {
      name: { type: "STRING" },
      price: { type: "NUMBER" },
      quantity: { type: "NUMBER" },
    };

    super(scheme, name);
  }
}

module.exports = ProductPartialDto;
