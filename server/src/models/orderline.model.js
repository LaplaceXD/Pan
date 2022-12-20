const { InternalServerError } = require("../../helpers/errors");
const { db } = require("../providers");

class OrderLine {
  constructor(line) {
    this.order_id = line.order_id;
    this.product_id = line.product_id;
    this.name = line.name || "";
    this.description = line.description || "";
    this.quantity = line.quantity;
    this.unit_price = line.unit_price ? parseFloat(line.unit_price) : 0;
    this.total = line.total ? parseFloat(line.total) : 0;
  }

  async save() {
    let retVal = null;

    try {
      const conn = await db.connect();
      await conn.execute(
        `INSERT INTO order_line (order_id, product_id, quantity, notes)
          VALUES (:order_id, :product_id, :quantity, :notes)`,
        { ...this, notes: "" }
      );

      const [details] = await conn.execute(
        `SELECT
          p.product_id,
          p.name,
          p.description,
          ol.quantity,
          p.unit_price,
          ol.quantity * p.unit_price AS subtotal
        FROM order_line ol
        INNER JOIN product p ON p.product_id = ol.product_id
        WHERE ol.order_id = :order_id
          AND ol.product_id = :product_id`,
        this
      );

      await conn.end();
      retVal = new OrderLine({ ...this, ...details[0] });
    } catch (err) {
      console.log("[ORDER LINE ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

  static async findAllByOrderId(orderId) {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [details] = await conn.execute(
        `SELECT
          p.product_id,
          p.name,
          p.description,
          ol.quantity,
          p.unit_price,
          ol.quantity * p.unit_price AS subtotal
        FROM order_line ol
        INNER JOIN product p ON p.product_id = ol.product_id
        WHERE ol.order_id = :orderId`,
        { orderId }
      );
      await conn.end();

      retVal = details.map((detail) => new OrderLine({ order_id: orderId, ...detail }));
    } catch (err) {
      console.log("[ORDER LINE ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }
}

module.exports = OrderLine;
