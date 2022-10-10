const Entity = require("../../lib/Entity");

class Product extends Entity {
  constructor(database) {
    const name = "Product";
    const scheme = {
      id: {
        type: "integer",
        unique: true,
        nullable: false,
        isPK: true,
        default: `nextval('UUID')`,
      },
      price: { type: "integer" },
      quantity: { type: "integer", default: 0 },
    };
    super(database, name, scheme);
  }
}

module.exports = Product;
