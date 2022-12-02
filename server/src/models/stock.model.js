const Joi = require("joi");
const { InternalServerError } = require("../../helpers/errors");
const { db, jwt } = require("../providers");
const { status, role } = require("../constants/employee");

class Stock{
  constructor(stock){
      this.stock_id       =   stock.stock_id || 0;
      this.product_id     =   stock.product_id;
      this.supplier_id    =   stock.supplier_id;
      this.date_supplied  =   stock.date_supplied;
      this.quantity       =   stock.quantity;
      this.unit           =   stock.unit;
      this.unit_price     =   stock.unit_price;
      this.notes          =   stock.notes;
  }
  async save(){
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `INSERT INTO stock (
          product_id,
          supplier_id,
          date_supplied,
          quantity ,
          unit,
          unit_price,
          notes) 
        VALUES (
          :product_id,
          :supplier_id,
          :date_supplied,
          :quantity ,
          :unit,
          :unit_price,
          :notes
        )`,
        this
      );

      this.stack_id = data.insertId;
      retVal = this;
    } catch (err) {
      console.log("[STOCK SAVE ERROR]", err.message);
      throw new InternalServerError(err);
    }
    return retVal;
  }

  static async findAll(){
    let retVal = [];
    try {
      const conn = await db.connect();
      const [data] = await conn.execute(`SELECT * FROM stock`);
      await conn.end();
      if(data.length !== 0 )retVal = data.map(d=>new Stock(d));
    } catch (err) {
      console.log("[STOCK VIEW ERROR]", err.message);
      throw new InternalServerError(err);
    }
    return retVal;
  }

  async edit(editedDetails){
    let retVal = null;
    const params = {...this, ...editedDetails};

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
          params
        );
      await conn.end();
      retVal = new Stock(params);
    } catch (err) {
      console.log("[STOCK EDIT ERROR]", err.message);
      throw new InternalServerError(err);
    }
    return retVal;
  }

  static validate(stock){
    const schema = Joi.object({
      product_id: Joi.number().greater(0).label("Product ID").required(),
      supplier_id: Joi.number().greater(0).label("Supplier ID").required(),
      date_supplied: Joi.date().label("Date Supplied").max("now").iso().required(),
      quantity: Joi.number().greater(-1).label("Quantity").required(),
      unit: Joi.string().label("Name").min(2).max(5).required().trim(),
      unit_price: Joi.number().label("Unit Price").precision(2).required(),
      notes: Joi.string().label("Notes").min(2).max(400).required(),
    })
    .options({ abortEarly: false, allowUnknown: true });

    return schema.validate(stock);
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
}
module.exports = Stock;