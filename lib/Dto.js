class Dto {
  constructor(scheme, name) {
    this.scheme = scheme;
    this.name = name;
  }
  validate(body) {
    let object = {};

    for (const [
      field,
      { required, type, scheme = {}, defaultVal = undefined },
    ] of Object.entries(this.scheme)) {
      const provided = body[field] !== undefined;

      if (provided) {
        object[field] = this.__checkType(body[field], type, scheme);
      } else {
        if (required) {
          if (defaultVal !== undefined) {
            object[field] = defaultVal;
            continue;
          }
          throw Error(`Bad Request: Не указано поле ${field}`);
        }
      }
    }

    return object;
  }

  __checkType(value, type, scheme) {
    switch (type.toUpperCase()) {
      case "STRING": {
        if (typeof value !== "string") {
          throw Error("Bad Request: Invalid string");
        }
        break;
      }
      case "NUMBER": {
        value = parseInt(value);
        if (Number.isNaN(value)) {
          throw Error(`Bad Request: Invalid number`);
        }
        break;
      }
      case "BOOLEAN": {
        if (typeof value !== "boolean") {
          throw Error("Bad Request: Invalid boolean");
        }
        break;
      }
      case "DATE": {
        value = Date.parse(value);
        if (Number.isNaN(value)) {
          throw Error("Bad Request: Invalid date");
        }
        value = new Date().setTime(value);
        break;
      }
      case "OBJECT": {
        value = new Dto(scheme).validate(value);
        break;
      }
      case "ARRAY": {
        if (!Array.isArray(value)) {
          throw Error("Bad Request: Invalid array");
        }

        const type = typeof scheme === "string" ? scheme : "object";

        value = value.map((__value) => this.__checkType(__value, type, scheme));
      }
    }

    return value;
  }
}

module.exports = Dto;
