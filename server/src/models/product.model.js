const Joi = require("joi");

const { InternalServerError, BadRequest, NotFound } = require("../../helpers/errors");

const { db, jwt } = require("../providers");
const { availability } = require("../constants/employee");

class Product {
  constructor(product) {
    this.product_id = product.product_id || 0;
    this.category_id = product.category_id || 0;
    this.creator_id = product.creator_id;
    this.date_created = product.date_created;
    this.name = product.name;
    this.description = product.description;
    this.unit_price = product.unit_price;
    this.image_src = product.image_src;
    this.is_available = product.is_available || availability.AVAILABLE;
  }

  // Displays all product data
  static async view() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.query(
        `SELECT *

        FROM 
          Product`
      );
      retVal = data;
      await conn.end();
    } catch (err) {
      console.log("[PRODUCT ERROR]", err.message);
    }

    return retVal;
  }

  // Saves the product into the database
  async create() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `INSERT INTO Product (creator_id, category_id, date_created, name, description, unit_price, image_src)
        VALUES (:creator_id, :category_id, :date_created, :name, :description, :unit_price, :image_src)`,
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
  async edit(edited_details) {
    let retVal = null;
    const params = {...this, ...edited_details};

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
          unit_price = :unit_price, 
          image_src = :image_src

        WHERE
          product_id = :product_id;
        `,
        params
      );
      await conn.end();
      retVal = new Product(params);
    } catch (err) {
      console.log("[PRODUCT ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

  // Deletes given product ID
  async delete() {
    try {
      const conn = await db.connect();
      await conn.execute(
        `DELETE FROM
          Product
          
        WHERE
          product_id = :product_id;
        `, this
      );
      
      await conn.end();
    } catch (err) {
      console.log("[PRODUCT ERROR]", err.message);
      throw new InternalServerError();
    }
  }

  // Toggles availability of given product 
  async toggleStatus() {
    try {
      const newVal = this.is_available === '1' ? '0' : '1';
      
      const conn = await db.connect();
      await conn.execute (
        `UPDATE Product 

        SET 
          is_available = ?

        WHERE
          product_id = ?;
        `, [newVal, this.product_id]);
      await conn.end();
    } catch (err) {
      console.log("[PRODUCT ERROR]", err.message);
      throw new InternalServerError();
    }
  }

  static async findById(id) {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute("SELECT * FROM product WHERE product_id = :id", { id });
      await conn.end();

      if (data.length !== 0) retVal = new Product(data[0]);
    } catch (err) {
      console.log("[EMPLOYEE DB ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  static async validate(product) {
    const schema = Joi.object()
      .keys({
        name: Joi.string().label("Name").min(2).max(300).required().trim(),
        description: Joi.string().label("Description").min(2).max(300).required().trim(),
        unit_price: Joi.number()
          .label("Unit Price")
          .precision(2)
          .required(),
        date_created: Joi.date().label("Date Created").max("now").iso().required(),
        creator_id: Joi.number().greater(0).label("Creator ID").required(),
        category_id: Joi.number().greater(0).label("Category ID"),
      })
      .options({ abortEarly: false, allowUnknown: true });

    return schema.validate(product);
  }
}

module.exports = Product;
