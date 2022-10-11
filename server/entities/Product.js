const path = require("path");
const Entity = require(path.join(process.env.BASE_DIR, "lib", "Entity"));

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
      name: { type: "varchar(250)" },
      price: { type: "integer" },
      quantity: { type: "integer", default: 0 },
    };
    super(database, name, scheme);
  }
}

module.exports = Product;
