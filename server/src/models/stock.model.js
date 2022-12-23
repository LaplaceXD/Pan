const Joi = require("joi");

const { InternalServerError } = require("../../helpers/errors");
const { db } = require("../providers");

const Product = require("../models/product.model");
const Supplier = require("../models/supplier.model");

class Stock {
  constructor(stock) {
    this.stock_id = stock.stock_id || 0;
    this.product_id = stock.product_id;
    this.product_name = stock.product_name || "";
    this.supplier_id = stock.supplier_id;
    this.supplier_name = stock.supplier_name || "";
    this.date_supplied = stock.date_supplied;
    this.quantity = stock.quantity;
    this.unit = stock.unit;
    this.unit_price = parseFloat(stock.unit_price);
    this.notes = stock.notes || "";
  }

  async save() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `INSERT INTO stock (
          product_id,
          supplier_id,
          date_supplied,
          quantity,
          unit,
          unit_price,
          notes) 
        VALUES (
          :product_id,
          :supplier_id,
          :date_supplied,
          :quantity,
          :unit,
          :unit_price,
          :notes
        )`,
        this
      );

      this.stock_id = data.insertId;
      retVal = this;
    } catch (err) {
      console.log("[STOCK SAVE ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  async update(details) {
    let retVal = null;
    const editedStock = { ...this, ...details };

    try {
      const conn = await db.connect();
      await conn.execute(
        `UPDATE stock 
        SET 
          date_supplied  =   :date_supplied,
          quantity       =   :quantity,
          unit           =   :unit,
          unit_price     =   :unit_price,
          notes          =   :notes
        WHERE 
          stock_id = :stock_id;`,
        editedStock
      );
      await conn.end();

      retVal = new Stock(editedStock);
    } catch (err) {
      console.log("[STOCK EDIT ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  async delete() {
    try {
      const conn = await db.connect();
      await conn.execute(`DELETE FROM stock WHERE stock_id = :stock_id`, this);
      await conn.end();
    } catch (err) {
      console.log("[STOCK DELETE ERROR]", err.message);
      throw new InternalServerError();
    }
  }

  static async findAll() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `SELECT 
            p.name AS product_name,
            sp.name AS supplier_name,
            s.*
          FROM stock s
          INNER JOIN product p ON p.product_id = s.product_id
          INNER JOIN supplier sp ON sp.supplier_id = s.supplier_id
          ORDER BY s.date_supplied, s.stock_id DESC`
      );
      await conn.end();

      retVal = data.map((d) => new Stock(d));
    } catch (err) {
      console.log("[STOCK VIEW ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  static async findAllByProductId(productId) {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `SELECT 
            p.name AS product_name,
            sp.name AS supplier_name,
            s.*
          FROM stock s
          INNER JOIN product p ON p.product_id = s.product_id
          INNER JOIN supplier sp ON sp.supplier_id = s.supplier_id
          WHERE s.product_id = :productId
          ORDER BY s.date_supplied DESC, s.stock_id DESC`,
        { productId }
      );
      await conn.end();

      retVal = data.map((d) => new Stock(d));
    } catch (err) {
      console.log("[STOCK VIEW ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  static async findAllBySupplierId(supplierId) {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `SELECT 
            p.name AS product_name,
            sp.name AS supplier_name,
            s.*
          FROM stock s
          INNER JOIN product p ON p.product_id = s.product_id
          INNER JOIN supplier sp ON sp.supplier_id = s.supplier_id
          WHERE s.supplier_id = :supplierId
          ORDER BY s.date_supplied, s.stock_id DESC`,
        { supplierId }
      );
      await conn.end();

      retVal = data.map((d) => new Stock(d));
    } catch (err) {
      console.log("[STOCK VIEW ERROR]", err.message);
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
            p.name AS product_name,
            sp.name AS supplier_name,
            s.*
          FROM stock s
          INNER JOIN product p ON p.product_id = s.product_id
          INNER JOIN supplier sp ON sp.supplier_id = s.supplier_id
          WHERE stock_id = :id
        `,
        { id }
      );
      await conn.end();

      if (data.length !== 0) retVal = new Stock(data[0]);
    } catch (err) {
      console.log("[STOCK FINDID ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  static async validate(stock) {
    let productMatch = "product_id" in stock ? await Product.findById(stock.product_id) : null;
    let supplierMatch = "supplier_id" in stock ? await Supplier.findById(stock.supplier_id) : null;

    let schema = Joi.object()
      .keys({
        date_supplied: Joi.date().label("Date Supplied").max("now").iso().required(),
        quantity: Joi.number().min(0).label("Quantity").required(),
        unit: Joi.string().label("Unit").min(2).max(5).required().trim(),
        unit_price: Joi.number().label("Unit Price").precision(2).required(),
        notes: Joi.string().label("Notes").min(2).max(400).allow(""),
        product_id: Joi.number()
          .label("Product ID")
          .not(!productMatch ? stock.product_id ?? null : null),
        supplier_id: Joi.number()
          .label("Supplier ID")
          .not(!supplierMatch ? stock.supplier_id ?? null : null),
      })
      .label("Payload")
      .options({ abortEarly: false })
      .required();

    return schema.validate(stock);
  }
}

module.exports = Stock;
