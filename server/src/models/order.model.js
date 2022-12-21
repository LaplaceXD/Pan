const Joi = require("joi");

const { InternalServerError, NotFound } = require("../../helpers/errors");
const { db } = require("../providers");

const OrderLine = require("./orderline.model");
const findProduct = require("./product.model").findById;

class Order {
  constructor(order) {
    this.order_id = order.order_id || 0;
    this.employee_id = order.employee_id;
    this.employee_name = order.employee_name || "";
    this.date_placed = order.date_placed || new Date();
    this.details = order.details || [];
    this.total = order.total ? parseFloat(order.total) : 0;
  }

  // Saves the order into the database
  async save() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [order] = await conn.execute("INSERT INTO `order` (employee_id) VALUES (:employee_id)", this);
      this.order_id = order.insertId;
      await conn.end();

      this.details = await Promise.all(
        this.details.map((detail) => new OrderLine({ ...detail, order_id: this.order_id }).save())
      );

      this.total = parseFloat(
        this.details.reduce((total, { total: subtotal }) => total + parseFloat(subtotal), 0).toFixed(2)
      );
      retVal = this;
    } catch (err) {
      console.log("[ORDER ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

  async delete() {
    try {
      const conn = await db.connect();
      await conn.execute("DELETE FROM `order` WHERE order_id = :order_id", this);
      await conn.end();
    } catch (err) {
      console.log("[ORDER ERROR]", err.message);
      throw new InternalServerError();
    }
  }

  // Displays all order data
  static async findAll() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [orders] = await conn.execute(
        `SELECT 
          o.order_id,
          o.employee_id,
          concat(e.first_name, ' ', e.last_name) AS employee_name,
          o.date_placed,
          SUM(p.unit_price * ol.quantity) AS total
        FROM ${"`order`"} o
        INNER JOIN employee e ON e.employee_id = o.employee_id
        INNER JOIN order_line ol ON ol.order_id = o.order_id
        INNER JOIN product p ON p.product_id = ol.product_id
        GROUP BY o.order_id
        ORDER BY o.date_placed DESC
        `
      );
      await conn.end();

      if (orders.length !== 0) retVal = orders.map((order) => new Order(order));
    } catch (err) {
      console.log("[ORDER ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

  static async findById(orderId) {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [order] = await conn.query(
        `SELECT 
          o.order_id,
          o.employee_id,
          concat(e.first_name, ' ', e.last_name) AS employee_name,
          o.date_placed,
          SUM(p.unit_price * ol.quantity) AS total
        FROM ${"`order`"} o
        INNER JOIN employee e ON e.employee_id = o.employee_id
        INNER JOIN order_line ol ON ol.order_id = o.order_id
        INNER JOIN product p ON p.product_id = ol.product_id
        WHERE o.order_id = :orderId
        GROUP BY o.order_id
        `,
        { orderId }
      );
      await conn.end();

      if (order.length !== 0) {
        const details = await OrderLine.findAllByOrderId(orderId);
        retVal = new Order({ ...order[0], details });
      }
    } catch (err) {
      console.log("[ORDER DB ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  /*
  loop thru each index
  find productID 
    validate if
      real product
      enough stock
  */
  static async validate(order) {

    if(Array.isArray(order)){
      for (let i = 0; i < order.length; i++) {
        let id = order[i].product_id;
        let amt = order[i].quantity;
        if(findProduct(id) == null){
          throw new NotFound("PRODUCT NOT FOUND");
        }else if(Order.getQty(id) < amt){
          throw new NotFound("NOT ENOUGH QUANTITY");
        }
      }
    }else{
      throw new NotFound("BODY IS NOT ARRAY");
    }
    const schema = Joi.array()
      .items(
        Joi.object({
          product_id: Joi.number().label("Product ID").min(1).required(),
          quantity: Joi.number().label("Quantity").min(1).required(),
        })
      )
      .options({ abortEarly: false });

    return schema.validate(order);
  }
  
  static async getQty(id){
    //SELECT SUM(quantity) FROM stock WHERE product_id = '1';
    
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute("SELECT SUM(quantity) as total FROM stock WHERE product_id = :id", { id });
      console.log(data);
      await conn.end();

      retVal = data[0].total;
    } catch (err) {
      console.log("[STOCK QUANTITY FIND ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }
}

module.exports = Order;
