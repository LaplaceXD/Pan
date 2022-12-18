const Joi = require("joi");

const { InternalServerError } = require("../../helpers/errors");

const { db } = require("../providers");
const { availability } = require("../constants/product");

const Category = require("../models/categories.model")

class Product {
  constructor(product) {
    this.product_id = product.product_id || 0;
    this.category_id = product.category_id || 0;
    this.category_name = product.category_name || "";
    this.creator_id = product.creator_id;
    this.date_created = product.date_created;
    this.name = product.name;
    this.description = product.description;
    this.unit_price = product.unit_price;
    this.image_src = product.image_src || "";
    this.is_available = product.is_available || availability.AVAILABLE;
  }

  // Saves the product into the database
  async save() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `INSERT INTO Product (creator_id, category_id, date_created, name, description, unit_price)
        VALUES (:creator_id, :category_id, :date_created, :name, :description, :unit_price)`,
        this
      );
      await conn.end();

      this.product_id = data.insertId;
      retVal = this;
    } catch (err) {
      console.log("[PRODUCT ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

  // Updates given product values
  async update(details) {
    let retVal = null;
    const editedProduct = { ...this, ...details };

    try {
      const conn = await db.connect();
      await conn.execute(
        `UPDATE Product 
        SET 
          creator_id = :creator_id, 
          category_id = :category_id, 
          date_created = :date_created, 
          name = :name, 
          description = :description, 
          unit_price = :unit_price
        WHERE
          product_id = :product_id;
        `,
        editedProduct
      );
      await conn.end();
      retVal = new Product(editedProduct);
    } catch (err) {
      console.log("[PRODUCT ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

  // Toggles availability of given product
  async toggleStatus() {
    try {
      this.is_available =
        this.is_available === availability.AVAILABLE ? availability.UNAVAILABLE : availability.AVAILABLE;

      const conn = await db.connect();
      await conn.execute(
        `UPDATE Product SET is_available = :is_available WHERE product_id = :product_id;`,
        this
      );
      await conn.end();
    } catch (err) {
      console.log("[PRODUCT ERROR]", err.message);
      throw new InternalServerError();
    }
  }

  // Displays all product data
  static async findAll() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.query(`SELECT p.product_id, p.category_id, c.name AS category_name, p.creator_id, p.date_created, p.name, p.description, p.unit_price, p.image_src, p.is_available FROM product AS p INNER JOIN category AS c ON p.category_id = c.category_id;`);
      await conn.end();

      retVal = data.map((d) => new Product(d));
    } catch (err) {
      console.log("[PRODUCT ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  static async findById(id) {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute("SELECT p.product_id, p.category_id, c.name AS category_name, p.creator_id, p.date_created, p.name, p.description, p.unit_price, p.image_src, p.is_available FROM product AS p INNER JOIN category AS c ON p.category_id = c.category_id WHERE product_id = :id", { id });
      await conn.end();

      if (data.length !== 0) retVal = new Product(data[0]);
    } catch (err) {
      console.log("[EMPLOYEE DB ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  static async validate(product) {
    let match = await Category.findById(product.category_id);
    match = (!match) ? product.category_id : null;

    const schema = Joi.object()
      .keys({
        name: Joi.string().label("Name").min(2).max(300).required().trim(),
        description: Joi.string().label("Description").min(2).max(300).required().trim(),
        unit_price: Joi.number().label("Unit Price").precision(2).required(),
        date_created: Joi.date().label("Date Created").max("now").iso().required(),
        category_id: Joi.number().min(0).label("Category ID").not(match),
      })
      .options({ abortEarly: false });

    return schema.validate(product);
  }
}

module.exports = Product;
