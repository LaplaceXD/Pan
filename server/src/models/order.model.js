const Joi = require("joi");

const { InternalServerError, BadRequest, NotFound } = require("../../helpers/errors");

const { db, jwt } = require("../providers");
const { availability } = require("../constants/employee");

class Order {
  constructor(order) {
    this.order_id = order.product_id || 0;
    this.employee_id = order.employee_id || 0;
    this.date_completed = order.date_completed;
  }

  // Displays all order data
  static async view() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [order] = await conn.query(
        "SELECT * FROM `order`"
      );
      const [orderline] = await conn.query(
        "SELECT ol.order_id, CONCAT(ep.first_name, ' ',ep.last_name) AS creator_name, e.employee_id, p.date_created, p.name, p.description, p.unit_price, p.image_src, ol.quantity, ol.notes FROM `order_line` AS `ol`  INNER JOIN `order` AS `o`ON ol.order_id = o.order_id INNER JOIN `product` AS `p` ON ol.product_id = p.product_id INNER JOIN `employee` AS `e` ON e.employee_id = o.employee_id INNER JOIN `employee` AS `ep` ON ep.employee_id = p.creator_id;"
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

//   // Saves the product into the database
//   async create() {
//     let retVal = null;

//     try {
//       const conn = await db.connect();
//       const [data] = await conn.execute(
//         `INSERT INTO Product (creator_id, category_id, date_created, name, description, unit_price, image_src)
//         VALUES (:creator_id, :category_id, :date_created, :name, :description, :unit_price, :image_src)`,
//         this
//       );
//       await conn.end();

//       this.product_id = data.insertId;
//       retVal = this;
//     } catch (err) {
//       console.log("[PRODUCT ERROR]", err.message);
//       throw new InternalServerError();
//     }

//     return retVal;
//   }

//   // Toggles availability of given product 
//   async toggleStatus() {
//     try {
//       const newVal = this.is_available === '1' ? '0' : '1';
      
//       const conn = await db.connect();
//       await conn.execute (
//         `UPDATE Product 

//         SET 
//           is_available = ?

//         WHERE
//           product_id = ?;
//         `, [newVal, this.product_id]);
//       await conn.end();
//     } catch (err) {
//       console.log("[PRODUCT ERROR]", err.message);
//       throw new InternalServerError();
//     }
//   }

//   static async validate(product) {
//     const schema = Joi.object()
//       .keys({
//         name: Joi.string().label("Name").min(2).max(300).required().trim(),
//         description: Joi.string().label("Description").min(2).max(300).required().trim(),
//         unit_price: Joi.number()
//           .label("Unit Price")
//           .precision(2)
//           .required(),
//         date_created: Joi.date().label("Date Created").max("now").iso().required(),
//         creator_id: Joi.number().greater(0).label("Creator ID").required(),
//         category_id: Joi.number().greater(0).label("Category ID"),
//       })
//       .options({ abortEarly: false, allowUnknown: true });

//     return schema.validate(product);
//   }
}

module.exports = Order;
