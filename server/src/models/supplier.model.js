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
    this.is_active = supplier.is_active
      ? supplier.is_active === true || supplier.is_active === status.ACTIVE
      : true;
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

  // Updates the supplier into the database
  async update(details) {
    let retVal = null;
    const editedSupplier = { ...this, ...details };

    try {
      const conn = await db.connect();
      await conn.execute(
        `UPDATE supplier 
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
        editedSupplier
      );
      await conn.end();

      retVal = new Supplier(editedSupplier);
    } catch (err) {
      console.log("[SUPPLIER ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

  // Deactivates supplier with given supplier ID
  async toggleStatus() {
    try {
      const is_active = this.is_active ? status.INACTIVE : status.ACTIVE;

      const conn = await db.connect();
      await conn.execute(`UPDATE supplier SET is_active = :is_active WHERE supplier_id = :supplier_id`, {
        ...this,
        is_active,
      });

      await conn.end();
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
      throw new InternalServerError();
    }
  }

  // Displays all supplier data
  static async findAll() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.query(`SELECT * FROM supplier ORDER BY supplier_id DESC`);
      await conn.end();

      retVal = data.map((d) => new Supplier(d));
    } catch (err) {
      console.log("[SUPPLIER ERROR]", err.message);
    }

    return retVal;
  }

  static async findById(supplier_id) {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `SELECT *
        FROM supplier
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
      building: Joi.string()
        .label("Building")
        .min(2)
        .max(150)
        .regex(/^[\w\s\-\&\']*$/)
        .message("{{#label}} must contain letters, digits, spaces, and special characters ('&-) only.")
        .allow(""),
      street_no: Joi.string()
        .label("Street Number")
        .min(2)
        .max(10)
        .regex(/^[\d\-]*$/)
        .message("{{#label}} must contain digits, and dashes only.")
        .allow("")
        .when("street_name", { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.forbidden() }),
      street_name: Joi.string()
        .label("Street Name")
        .min(2)
        .max(150)
        .regex(/^[\w\s\-\&\']*$/)
        .message("{{#label}} must contain letters, digits, spaces, and special characters ('&-) only.")
        .allow(""),
      city: Joi.string()
        .label("City")
        .regex(/^[\w\s\-\&\']*$/)
        .message("{{#label}} must contain letters, digits, spaces, and special characters ('&-) only.")
        .required(),
      zip_code: Joi.string()
        .label("Zip Code")
        .length(4)
        .regex(/^\d*$/)
        .message("{{#label}} must contain digits only.")
        .required(),
      contact_no: Joi.string()
        .label("Contact Number")
        .length(11)
        .regex(/^\d*$/)
        .message("{{#label}} must contain digits only."),
      email: Joi.string().label("Email").email().required(),
    })
      .label("Payload")
      .options({ abortEarly: false })
      .required();

    return schema.validate(supplier);
  }
}

module.exports = Supplier;
