const Joi = require("joi");

const { InternalServerError } = require("../../helpers/errors");

const { db } = require("../providers");
const { status } = require("../constants/supplier");

class Supplier {
  constructor(supplier) {
    this.supplier_id = supplier.supplier_id || 0;
    this.name = supplier.name;
    this.building = supplier.building || "";
    this.street_no = supplier.street_no || "";
    this.street_name = supplier.street_name || "";
    this.city = supplier.city;
    this.zip_code = supplier.zip_code;
    this.contact_no = supplier.contact_no;
    this.email = supplier.email;
    this.is_active = supplier.is_active || status.ACTIVE;
  }

  // Displays all supplier data
  static async view() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.query(
        `SELECT  
          name,
          city,
          zip_code,
          contact_no,
          email,
          is_active

        FROM 
          Supplier`
      );
      await conn.end();
      retVal = data;
    } catch (err) {
      console.log("[SUPPLIER ERROR]", err.message);
    }

    return retVal;
  }

  // Saves the supplier into the database
  async save() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `INSERT INTO Supplier (
          name,
          building,
          street_no,
          street_name,
          city,
          zip_code,
          contact_no,
          email
        )
        VALUES (
          :name,
          :building,
          :street_no,
          :street_name,
          :city,
          :zip_code,
          :contact_no,
          :email
        )`,
        this
      );
      await conn.end();

      this.supplier_id = data.insertId;
      retVal = this;
    } catch (err) {
      console.log("[SUPPLIER ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

  // Saves the supplier into the database
  async edit(edited_details) {
    let retVal = null;
    const params = { ...this, ...edited_details };

    try {
      const conn = await db.connect();
      const [] = await conn.execute(
        `UPDATE 
          Supplier 
        
        SET
          name = :name,
          building = :building,
          street_no = :street_no,
          street_name = :street_name,
          city = :city,
          zip_code = :zip_code,
          contact_no = :contact_no,
          email = :email
        
        WHERE
          supplier_id = :supplier_id
        `,
        params
      );
      await conn.end();
      retVal = new Supplier(params);
    } catch (err) {
      console.log("[SUPPLIER ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

  // Deactivates supplier with given supplier ID
  async toggleStatus() {
    try {
      const newVal = this.is_active === "1" ? "0" : "1";

      const conn = await db.connect();
      await conn.execute(
        `UPDATE Supplier 

        SET 
          is_active = ?

        WHERE
          supplier_id = ?;
        `,
        [newVal, this.supplier_id]
      );

      await conn.end();
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
      throw new InternalServerError();
    }
  }

  static async findById(supplier_id) {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `SELECT *
        FROM Supplier
        WHERE supplier_id = :supplier_id`,
        { supplier_id }
      );
      await conn.end();
      if (data.length !== 0) {
        retVal = new Supplier(data[0]);
      }
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

  static validate(supplier) {
    const schema = Joi.object({
      name: Joi.string().label("Name").min(2).max(300).required(),
      building: Joi.string().label("Building"),
      street_no: Joi.string().label("Street Number"),
      street_name: Joi.string().label("Street Name"),
      city: Joi.string().label("City").required(),
      zip_code: Joi.string().label("Zip Code").required(),
      contact_no: Joi.string()
        .label("Contact Number")
        .length(11)
        .regex(/^\d{11}$/)
        .message("Contact number must contain digits only."),
      email: Joi.string().label("Email").email().required(),
    });
    return schema.validate(supplier);
  }
}

module.exports = Supplier;
