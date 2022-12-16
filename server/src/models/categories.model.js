const Joi = require("joi");
const { InternalServerError } = require("../../helpers/errors");
const { db } = require("../providers");

class Category {
  constructor(category) {
    this.category_id = category.category_id;
    this.name = category.name;
    this.image_src = category.image_src;
    this.is_available = category.is_available ? category.is_available : 1;
  }

  async save() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `INSERT INTO category (
          category_id, 
          name, 
          image_src, 
          is_available) 
        VALUES (
          NULL, 
          :name, 
          :image_src, 
          :is_available
        )`,
        this
      );

      this.category_id = data.insertId;
      retVal = this;
    } catch (err) {
      console.log("[CATEGORY SAVE ERROR]", err.message);
      throw new InternalServerError(err);
    }
    return retVal;
  }

  static async findAll() {
    let retVal = [];
    try {
      const conn = await db.connect();
      const [data] = await conn.execute(`SELECT * FROM category`);
      await conn.end();
      if (data.length !== 0) retVal = data.map((d) => new Category(d));
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

  async edit(editedDetails) {
    let retVal = null;
    const params = { ...this, ...editedDetails };

    try {
      const conn = await db.connect();
      await conn.execute(
        `UPDATE category 
        SET 
          name = :name, 
          image_src= :image_src 

        WHERE 
          category_id = :category_id;`,
        params
      );
      await conn.end();
      retVal = new Category(params);
    } catch (err) {
      console.log("[CATEGORY EDIT ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  async delete() {
    try {
      const conn = await db.connect();
      await conn.execute(
        `DELETE FROM
          Category
          
        WHERE
          category_id = :category_id;
        `,
        this
      );

      await conn.end();
    } catch (err) {
      console.log("[CATEGORY DELETE ERROR]", err.message);
      throw new InternalServerError();
    }
  }

  async toggleStatus() {
    try {
      const newVal = this.is_available === "1" ? "0" : "1";

      const conn = await db.connect();
      await conn.execute(
        `UPDATE Category 
        SET 
          is_available = ?
        WHERE
          category_id = ?;
        `,
        [newVal, this.category_id]
      );
      await conn.end();
    } catch (err) {
      console.log("[CATEGORY ERROR]", err.message);
      throw new InternalServerError();
    }
  }

  static validate(category) {
    const schema = Joi.object({
      name: Joi.string().label("Name").min(2).max(100).required(),
      image_src: Joi.string().label("Image Source"),
    }).options({ abortEarly: false });

    return schema.validate(category);
  }
}

module.exports = Category;
