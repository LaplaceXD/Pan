const Joi = require("joi");

const { InternalServerError, BadRequest, NotFound } = require("../../helpers/errors");

const { db, jwt } = require("../providers");
const { status, role } = require("../constants/employee");

class Employee {
  constructor(employee) {
    this.employee_id = employee.employee_id || 0;
    this.first_name = employee.first_name;
    this.last_name = employee.last_name;
    this.password = employee.password || "";
    this.contact_no = employee.contact_no;
    this.email = employee.email;
    this.date_employed = employee.date_employed;
    this.image_src = employee.image_src;
    this.role = employee.role || role.EMPLOYEE;
    this.is_active = employee.is_active || status.ACTIVE;
  }

  async tokenize(jti) {
    try {
      return await jwt.TokenPair.create(
        {
          id: this.employee_id,
          first_name: this.first_name,
          last_name: this.last_name,
          role: this.role,
        },
        jti
      );
    } catch (err) {
      console.log("[JWT ERROR]", err);
      throw new InternalServerError(err);
    }
  }

  // Displays all employee data
  static async view() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.query(
        `SELECT  
          first_name,
          last_name,
          email,
          contact_no,
          date_employed,
          image_src

        FROM 
          Employee`
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
        `INSERT INTO Employee (first_name, last_name, password, contact_no, email, date_employed, image_src)
        VALUES (:first_name, :last_name, :password, :contact_no, :email, :date_employed, :image_src)`,
        this
      );
      await conn.end();

      this.employee_id = data.insertId;
      retVal = this;
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

  // Updates given employee values
  async edit(edited_details) {
    let retVal = null;
    const params = {...this, ...edited_details};

    try {
      const conn = await db.connect();
      await conn.execute(
        `UPDATE Employee 

        SET 
          first_name = :first_name,
          last_name = :last_name,
          contact_no = :contact_no,
          email = :email,
          date_employed = :date_employed,
          image_src = :image_src

        WHERE
          employee_id = :employee_id;
        `,
        params
      );
      await conn.end();
      retVal = new Employee(params);
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }
  
  // Deletes password and saves new value
  async reset() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const data = await conn.execute(
        `UPDATE Employee 

        SET 
          password = :password

        WHERE
          employee_id = :employee_id;
        `,
        this
      );
      await conn.end();
      this.employee_id = data.insertId;
      retVal = this;
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

  // Deactivates account with given employee ID
  async toggleStatus() {
    try {
      const newVal = this.is_active === '1' ? '0' : '1';
      
      const conn = await db.connect();
      await conn.execute (
        `UPDATE Employee 

        SET 
          is_active = ?

        WHERE
          employee_id = ?;
        `, [newVal, this.employee_id]);
      await conn.end();
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
      throw new InternalServerError();
    }
  }

  static async findByEmail(email) {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute("SELECT * FROM employee WHERE email = :email", { email });
      await conn.end();

      if (data.length !== 0) retVal = new Employee(data[0]);
    } catch (err) {
      console.log("[EMPLOYEE DB ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  static async findById(id) {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute("SELECT * FROM employee WHERE employee_id = :id", { id });
      await conn.end();

      if (data.length !== 0) retVal = new Employee(data[0]);
    } catch (err) {
      console.log("[EMPLOYEE DB ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  static async validate(employee) {
    const match = await Employee.findByEmail(employee.email);

    const schema = Joi.object()
      .keys({
        first_name: Joi.string().label("First Name").min(2).max(300).required().trim(),
        last_name: Joi.string().label("Last Name").min(2).max(300).required().trim(),
        email: Joi.string()
          .label("Email")
          .email()
          .not(match?.email ?? "")
          .required()
          .messages({
            "any.invalid": "{{#label}} is already in use.",
          })
          .trim(),
        contact_no: Joi.string()
          .label("Contact Number")
          .length(11)
          .regex(/^\d+$/)
          .message("{{#label}} must contain digits only.")
          .required()
          .trim(),
        date_employed: Joi.date().label("Date Employed").max("now").iso().required(),
      })
      .options({ abortEarly: false, allowUnknown: true });

    return schema.validate(employee);
  }
}

module.exports = Employee;
