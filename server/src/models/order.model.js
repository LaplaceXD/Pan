const Joi = require("joi");

const { InternalServerError } = require("../../helpers/errors");
const { db } = require("../providers");

class Order {
  constructor(order) {
    this.order_id = order.order_id || 0;
    this.employee_id = order.employee_id;
    this.employee_name = order.employee_name || "";
    this.date_placed = order.date_placed || new Date();
    this.details = order.details || [];
    this.total = order.total || 0;
  }

  // Saves the order into the database
  async save() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [order] = await conn.execute("INSERT INTO `order` (employee_id) VALUES (:employee_id)", this);
      this.order_id = order.insertId;

      this.details = await Promise.all(
        this.details.map(async (orderLine) => {
          await conn.execute(
            `INSERT INTO order_line (order_id, product_id, quantity, notes)
          VALUES (:order_id, :product_id, :quantity, :notes)`,
            { order_id: this.order_id, notes: "", ...orderLine }
          );

          const [detail] = await conn.execute(
            `SELECT
              p.product_id,
              p.name,
              p.description,
              ol.quantity,
              p.unit_price,
              ol.quantity * p.unit_price AS subtotal,
              ol.notes,
              p.image_src,
              p.date_created,
              c.name AS category_name
            FROM order_line ol
            INNER JOIN product p ON p.product_id = ol.product_id
            INNER JOIN category c ON c.category_id = p.category_id
            WHERE ol.order_id = :order_id
            AND ol.product_id = :product_id`,
            { order_id: this.order_id, product_id: orderLine.product_id }
          );

          return detail[0];
        })
      );

      await conn.end();

      this.total = this.details.reduce((total, { subtotal }) => total + parseFloat(subtotal), 0).toFixed(2);
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

  static async findById(order_id) {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [order] = await conn.execute(
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
        WHERE o.order_id = :order_id
        GROUP BY o.order_id
        `,
        { order_id }
      );

      if (order.length !== 0) {
        const [details] = await conn.execute(
          `SELECT
              p.product_id,
              p.name,
              p.description,
              ol.quantity,
              p.unit_price,
              ol.quantity * p.unit_price AS subtotal,
              ol.notes,
              p.image_src,
              p.date_created,
              c.name AS category_name
            FROM ${"`order`"} o
            INNER JOIN order_line ol ON ol.order_id = o.order_id
            INNER JOIN product p ON p.product_id = ol.product_id
            INNER JOIN category c ON c.category_id = p.category_id
            WHERE o.order_id = :order_id
          `,
          { order_id }
        );

        retVal = new Order({ ...order[0], details });
      }

      await conn.end();
    } catch (err) {
      console.log("[ORDER DB ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  static async validate(order) {
    const schema = Joi.array()
      .items(
        Joi.object({
          product_id: Joi.number().label("Product ID").min(1).required(),
          quantity: Joi.number().label("Quantity").min(1).required(),
          notes: Joi.string().label("Notes").min(0).max(300),
        })
      )
      .options({ abortEarly: false });

    return schema.validate(order);
  }
}

module.exports = Order;
