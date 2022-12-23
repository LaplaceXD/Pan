const Joi = require("joi");

const { InternalServerError } = require("../../helpers/errors");
const { db } = require("../providers");

const OrderLine = require("./orderline.model");
const Product = require("./product.model");

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

  static async validate(order) {
    let values = await Promise.all(order.map(({ product_id }) => Product.findById(product_id)));
    values = values.filter(Boolean);

    const schema = Joi.array()
      .items(
        Joi.object({
          product_id: Joi.number()
            .label("Product ID")
            .custom((value, helpers) => {
              const exists = values.find((product) => product.product_id === value);
              return exists ? value : helpers.message("{{#label}} contains an invalid value");
            })
            .required(),
          quantity: Joi.number()
            .label("Quantity")
            .min(1)
            .custom((value, { state, message }) => {
              const product = values.find(({ product_id }) => product_id === state.ancestors[0].product_id);
              return product.available_stock >= value
                ? value
                : message(`"Product ID" ${product.product_id} exceeds available stock.`);
            })
            .required(),
        })
      )
      .min(1)
      .label("Payload")
      .required()
      .options({ abortEarly: false });

    return schema.validate(order);
  }
}

module.exports = Order;
