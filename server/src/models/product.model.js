const Joi = require("joi");

const { InternalServerError } = require("../../helpers/errors");

const { db } = require("../providers");
const { availability } = require("../constants/product");

const Category = require("../models/categories.model");

class Product {
  constructor(product) {
    this.product_id = product.product_id || 0;
    this.category_id = product.category_id || null;
    this.category_name = product.category_name || "";
    this.creator_id = product.creator_id;
    this.date_created = product.date_created || new Date();
    this.name = product.name;
    this.description = product.description;
    this.unit_price = parseFloat(product.unit_price);
    this.image_src = product.image_src || "";
    this.is_available = product.is_available
      ? product.is_available === true || product.is_available === availability.AVAILABLE
      : true;
    this.available_stock = product.available_stock ? parseInt(product.available_stock) : 0;
  }

  // Saves the product into the database
  async save() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `INSERT INTO product (creator_id, category_id, name, description, unit_price)
        VALUES (:creator_id, :category_id, :name, :description, :unit_price)`,
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
        `UPDATE product 
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
      const is_available = this.is_available ? availability.UNAVAILABLE : availability.AVAILABLE;

      const conn = await db.connect();
      await conn.execute(
        `UPDATE product SET is_available = :is_available WHERE product_id = :product_id;`,
        { ...this, is_available }
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
      const [data] = await conn.execute(
        `SELECT
          COALESCE(c.name, "Others") AS category_name,
          p.*,
          COALESCE(s.total_stock - SUM(ol.quantity), 0) AS available_stock
        FROM product p 
        LEFT JOIN (SELECT 
                    SUM(quantity) AS total_stock,
                    product_id
                  FROM stock
                  GROUP BY product_id) s ON s.product_id = p.product_id
        LEFT JOIN order_line ol ON ol.product_id = p.product_id
        LEFT JOIN category c ON c.category_id = p.category_id
        GROUP BY p.product_id
        ORDER BY p.product_id DESC`
      );

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
      const [data] = await conn.execute(
        `SELECT
          COALESCE(c.name, "Others") AS category_name,
          p.*,
          COALESCE(s.total_stock - SUM(ol.quantity), 0) AS available_stock
        FROM product p 
        LEFT JOIN (SELECT 
                    SUM(quantity) AS total_stock,
                    product_id
                  FROM stock
                  GROUP BY product_id) s ON s.product_id = p.product_id
        LEFT JOIN order_line ol ON ol.product_id = p.product_id
        LEFT JOIN category c ON c.category_id = p.category_id
        WHERE p.product_id = :id
        GROUP BY p.product_id`,
        { id }
      );
      await conn.end();

      if (data.length !== 0) retVal = new Product(data[0]);
    } catch (err) {
      console.log("[EMPLOYEE DB ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  static async validate(product) {
    let match = "category_id" in product ? await Category.findById(product.category_id) : null;

    const schema = Joi.object()
      .keys({
        name: Joi.string()
          .label("Name")
          .min(2)
          .max(300)
          .regex(/^[\w\s\&]*$/)
          .message("{{#label}} must contain letters, digits, and spaces only.")
          .required()
          .trim(),
        description: Joi.string().label("Description").min(2).max(300).required().trim(),
        unit_price: Joi.number().label("Unit Price").precision(2).required(),
        category_id: Joi.number()
          .min(0)
          .label("Category ID")
          .not("category_id" in product && !match ? product.category_id : 0),
      })
      .options({ abortEarly: false })
      .required();

    return schema.validate(product);
  }
}

module.exports = Product;
