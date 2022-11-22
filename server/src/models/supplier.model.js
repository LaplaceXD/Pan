const Joi = require("joi");

const { InternalServerError, BadRequest } = require("../../helpers/errors");

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

          
      this.supplier_id = data.insertId;
      retVal = this;

    } catch (err) {
      console.log("[SUPPLIER ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

  // Saves the supplier into the database
  async edit() {
    let retVal = null;

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
        this
      );
      retVal = this;

    } catch (err) {
      console.log("[SUPPLIER ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

  // Deactivates supplier with given supplier ID
  async deactivate() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `UPDATE 
          Supplier 
        
        SET
          is_active = '0'
        
        WHERE
          supplier_id = :supplier_id
        `,
        this
      );

      retVal = {
        supplier_id: this.supplier_id,
        name: this.name,
        contact_no: this.contact_no,
        email: this.email,
      };

    } catch (err) {
      console.log("[SUPPLIER ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

  async getId(given_id) {
    this.supplier_id = given_id;

    try {
      const conn = await db.connect();
      const [data] = await conn.query(
        `SELECT 
          * 
        FROM 
          Supplier 
        WHERE 
          supplier_id = :supplier_id`
        ,this)

        if (!data[0]) throw new BadRequest();
      
    } catch (err) {
      console.log("[SUPPLIER ERROR]", err.message);
      throw new InternalServerError();
    }
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
      email: Joi.string().label("Email").email().required()
    });
    return schema.validate(supplier);
  }
}

module.exports = Supplier;
