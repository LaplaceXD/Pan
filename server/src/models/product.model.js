const Joi = require("joi");

const { InternalServerError, BadRequest, NotFound } = require("../../helpers/errors");

const { db, jwt } = require("../providers");
const { availability } = require("../constants/employee");

class Product {
  constructor(product) {
    this.product_id = product.product_id || 0;
    this.category_id = product.category_id || 0;
    this.creator_id = product.creator_id;
    this.date_created = product.date_created;
    this.name = product.name;
    this.description = product.description;
    this.unit_price = product.unit_price;
    this.image_src = product.image_src;
    this.is_available = product.is_available || availability.AVAILABLE;
  }

  // Displays all product data
  static async view() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.query(
        `SELECT *

        FROM 
          Product`
      );
      retVal = data;
      await conn.end();
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
    }

    return retVal;
  }

  // Saves the employee into the database
  async create() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `INSERT INTO Product (creator_id, category_id, date_created, name, description, unit_price, image_src)
        VALUES (:creator_id, :category_id, :date_created, :name, :description, :unit_price, :image_src)`,
        this
      );
      await conn.end();

      this.product_id = data.insertId;
      retVal = this;
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

//   // Updates given employee values
//   async edit(edited_details) {
//     let retVal = null;
//     const params = {...this, ...edited_details};

//     try {
//       const conn = await db.connect();
//       await conn.execute(
//         `UPDATE Employee 

//         SET 
//           first_name = :first_name,
//           last_name = :last_name,
//           contact_no = :contact_no,
//           email = :email,
//           date_employed = :date_employed,
//           image_src = :image_src

//         WHERE
//           employee_id = :employee_id;
//         `,
//         params
//       );
//       await conn.end();
//       retVal = new Employee(params);
//     } catch (err) {
//       console.log("[EMPLOYEE ERROR]", err.message);
//       throw new InternalServerError();
//     }

//     return retVal;
//   }
  
//   // Deletes password and saves new value
//   async reset() {
//     let retVal = null;

//     try {
//       const conn = await db.connect();
//       const data = await conn.execute(
//         `UPDATE Employee 

//         SET 
//           password = :password

//         WHERE
//           employee_id = :employee_id;
//         `,
//         this
//       );
//       await conn.end();
//       this.employee_id = data.insertId;
//       retVal = this;
//     } catch (err) {
//       console.log("[EMPLOYEE ERROR]", err.message);
//       throw new InternalServerError();
//     }

//     return retVal;
//   }

//   // Deactivates account with given employee ID
//   async toggleStatus() {
//     try {
//       const newVal = this.is_active === '1' ? '0' : '1';
      
//       const conn = await db.connect();
//       await conn.execute (
//         `UPDATE Employee 

//         SET 
//           is_active = ?

//         WHERE
//           employee_id = ?;
//         `, [newVal, this.employee_id]);
//       await conn.end();
//     } catch (err) {
//       console.log("[EMPLOYEE ERROR]", err.message);
//       throw new InternalServerError();
//     }
//   }

//   static async findByEmail(email) {
//     let retVal = null;

//     try {
//       const conn = await db.connect();
//       const [data] = await conn.execute("SELECT * FROM employee WHERE email = :email", { email });
//       await conn.end();

//       if (data.length !== 0) retVal = new Employee(data[0]);
//     } catch (err) {
//       console.log("[EMPLOYEE DB ERROR]", err.message);
//       throw new InternalServerError(err);
//     }

//     return retVal;
//   }

//   static async findById(id) {
//     let retVal = null;

//     try {
//       const conn = await db.connect();
//       const [data] = await conn.execute("SELECT * FROM employee WHERE employee_id = :id", { id });
//       await conn.end();

//       if (data.length !== 0) retVal = new Employee(data[0]);
//     } catch (err) {
//       console.log("[EMPLOYEE DB ERROR]", err.message);
//       throw new InternalServerError(err);
//     }

//     return retVal;
//   }

  static async validate(product) {
    const schema = Joi.object()
      .keys({
        name: Joi.string().label("Name").min(2).max(300).required().trim(),
        description: Joi.string().label("Description").min(2).max(300).required().trim(),
        unit_price: Joi.number()
          .label("Unit Price")
          .precision(2)
          .required(),
        date_created: Joi.date().label("Date Created").max("now").iso().required(),
        creator_id: Joi.number().greater(0).label("Creator ID").required(),
        category_id: Joi.number().greater(0).label("Category ID"),
      })
      .options({ abortEarly: false, allowUnknown: true });

    return schema.validate(product);
  }
}

module.exports = Product;
