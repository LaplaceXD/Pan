const Joi = require("joi");

const { InternalServerError, BadRequest, NotFound } = require("../../helpers/errors");

const { db, jwt } = require("../providers");
const { availability } = require("../constants/employee");

class Order {
  constructor(order) {
    this.order_id = order.product_id;
    this.employee_id = order.employee_id || 0;
    this.date_completed = order.date_completed;
    this.lines = order.lines || [];
  }

  // Displays all order data
  static async view() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [order] = await conn.query(
        "SELECT order_id, employee_id, date_completed AS date_created FROM `order`"
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

  // Saves the product into the database
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

      this.product_id = data.insertId;
      retVal = this;
    } catch (err) {
      console.log("[PRODUCT ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

  static async validate(product) {
    const schema = Joi.object()
      .keys({
        employee_id: Joi.number().label("Employee ID").min(1).required(),
        date_completed: Joi.date().label("Date Employed").max("now").iso().required(),
        lines: Joi.array().items(
            Joi.object({
                product_id: Joi.number().min(0).required(),
                quantity: Joi.number().min(0).required(),
                notes: Joi.string().label("Notes").min(0).max(300).required(),
            })
        ).required(),
      })
      .options({ abortEarly: false, allowUnknown: true });

    return schema.validate(product);
  }
}

module.exports = Order;