const { boolean } = require("joi");
const Joi = require("joi");
const { InternalServerError,NotFound } = require("../../helpers/errors");
const { db } = require("../providers");
const findProduct = require("./product.model").findById;
const findSupplier = require("./supplier.model").findById;

class Stock {
  constructor(stock) {
    this.stock_id = stock.stock_id || 0;
    this.product_id = stock.product_id;
    this.supplier_id = stock.supplier_id;
    this.date_supplied = stock.date_supplied;
    this.quantity = stock.quantity;
    this.unit = stock.unit;
    this.unit_price = stock.unit_price;
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
      return retVal
    } catch (err) {
      console.log("[STOCK SAVE ERROR]", err.message);
      throw new InternalServerError(err);
    };
    
  }
  async update(details) {
    let retVal = null;
    const editedStock = { ...this, ...details };

    try {
      const conn = await db.connect();
      await conn.execute(
        `UPDATE stock 
        SET 
          product_id     =   :product_id,
          supplier_id    =   :supplier_id,
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
      const [data] = await conn.execute(`SELECT * FROM stock`);
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
      const [data] = await conn.execute("SELECT * FROM stock WHERE stock_id = :id", { id });
      console.log(data);
      await conn.end();

      if (data.length !== 0) retVal = new Stock(data[0]);
    } catch (err) {
      console.log("[STOCK FINDID ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  static validate(stock, params = {}) {
    const { id } = params;

    let schema = {
      date_supplied: Joi.date().label("Date Supplied").max("now").iso().required(),
      quantity: Joi.number().min(0).label("Quantity").required(),
      unit: Joi.string().label("Unit").min(2).max(5).required().trim(),
      unit_price: Joi.number().label("Unit Price").precision(2).required(),
      notes: Joi.string().label("Notes").min(2).max(400),
    };

    // If creating then include checking for product_id, and supplier_id
      //checking
    if(findProduct(stock.product_id)!=null&&findSupplier(stock.supplier_id)!=null){throw new NotFound("PRODUCTANDORSUPPLIERID_ERROR");}
    if (!id) {
      schema = {
        product_id: Joi.number().greater(0).label("Product ID").required(),
        supplier_id: Joi.number().greater(0).label("Supplier ID").required(),
        ...schema,
      };
    }

    schema = Joi.object().keys(schema).options({ abortEarly: false });
    return schema.validate(stock);
  }
}

module.exports = Stock;
