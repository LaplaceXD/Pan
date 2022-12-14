const Joi = require("joi");

const { InternalServerError } = require("../../helpers/errors");

const { db } = require("../providers");

class Order {
    constructor(order) {
      this.order_id = order.product_id;
      this.employee_id = order.employee_id || 0;
      this.date_completed = order.date_completed;
      this.lines = order.lines || [];
    }

  // Saves the order into the database
  async create() {
    
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        "INSERT INTO `Order` (employee_id, date_completed) VALUES (?, ?)",
        [this.employee_id, this.date_completed]
      );
      
      this.lines.forEach( async (orderline) => {
        await conn.execute(
          `INSERT INTO order_line (order_id, product_id, quantity, notes)
          VALUES (?, ?, ?, ?)`, 
          [data.insertId, orderline.product_id, orderline.quantity, orderline.notes]
        )
      });
      
      await conn.end();

      this.order_id = data.insertId;
      retVal = this;
    } catch (err) {
      console.log("[ORDER ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

  // Deactivates/Activates an account with given employee ID
  async toggleStatus() {
    try {
      this.is_active = this.is_active === status.ACTIVE ? status.INACTIVE : status.ACTIVE;

      const conn = await db.connect();
      await conn.execute(
        `UPDATE Employee SET is_active = :is_active WHERE employee_id = :employee_id`,
        this
      );

      await conn.end();
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
      throw new InternalServerError();
    }
  }

  // Displays all order data
  static async findAll() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [order] = await conn.query(
        "SELECT order_id, employee_id, date_completed AS date_placed FROM `order`"
      );
      const [orderline] = await conn.query(
        "SELECT ol.order_id, p.name, p.description, p.unit_price, p.image_src, ol.quantity, ol.notes FROM `order_line` AS `ol`  INNER JOIN `order` AS `o`ON ol.order_id = o.order_id INNER JOIN `product` AS `p` ON ol.product_id = p.product_id INNER JOIN `employee` AS `e` ON e.employee_id = o.employee_id INNER JOIN `employee` AS `ep` ON ep.employee_id = p.creator_id;"
      );

      order.forEach( (order) => {
        order["lines"] = [];
        orderline.forEach( (orderline) => {
            if (orderline["order_id"] == order["order_id"]) {
                delete orderline["order_id"];
                order["lines"].push(orderline);
            }
        })
            
      });
    
      retVal = order;
      await conn.end();
    } catch (err) {
      console.log("[ORDER ERROR]", err.message);
    }

    return retVal;
  }

  static async validate(order) {
    const schema = Joi.object()
      .keys({
        employee_id: Joi.number().label("Employee ID").min(1).required(),
        date_completed: Joi.date().label("Date Completed").max("now").iso().required(),
        lines: Joi.array().items(
            Joi.object({
                product_id: Joi.number().min(0).required(),
                quantity: Joi.number().min(0).required(),
                notes: Joi.string().label("Notes").min(0).max(300).required(),
            })
        ).required(),
      })
      .options({ abortEarly: false });

    return schema.validate(order);
  }
}

module.exports = Order;
