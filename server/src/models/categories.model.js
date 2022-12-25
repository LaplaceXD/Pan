const Joi = require("joi");

const { InternalServerError } = require("../../helpers/errors");
const { db } = require("../providers");

class Category {
  constructor(category) {
    this.category_id = category.category_id || 0;
    this.name = category.name;
  }

  async save() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(`INSERT INTO category (name) VALUES (:name)`, this);

      this.category_id = data.insertId;
      retVal = this;
    } catch (err) {
      console.log("[CATEGORY SAVE ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  async update(details) {
    let retVal = null;
    const editedCategory = { ...this, ...details };

    try {
      const conn = await db.connect();
      await conn.execute(
        `UPDATE category
        SET name = :name
        WHERE category_id = :category_id`,
        editedCategory
      );

      await conn.end();
      retVal = new Category(editedCategory);
    } catch (err) {
      console.log("[CATEGORY EDIT ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  async delete() {
    try {
      const conn = await db.connect();
      await conn.execute(`DELETE FROM category WHERE category_id = :category_id`, this);
      await conn.end();
    } catch (err) {
      console.log("[CATEGORY DELETE ERROR]", err.message);
      throw new InternalServerError();
    }
  }

  static async findAll() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(`SELECT * FROM category ORDER BY category_id DESC`);
      await conn.end();

      retVal = data.map((d) => new Category(d));
    } catch (err) {
      console.log("[CATEGORY VIEW ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  static async findById(id) {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute("SELECT * FROM category WHERE category_id = :id", { id });
      await conn.end();

      if (data.length !== 0) retVal = new Category(data[0]);
    } catch (err) {
      console.log("[CATEGORY FIND ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  static validate(category) {
    const schema = Joi.object({
      name: Joi.string()
        .label("Name")
        .regex(/^[\w\s\&]*$/)
        .message("{{#label}} must contain letters, digits, and spaces only.")
        .min(2)
        .max(100)
        .required(),
    })
      .label("Payload")
      .options({ abortEarly: false })
      .required();

    return schema.validate(category);
  }
}

module.exports = Category;
