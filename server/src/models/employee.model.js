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

  tokenize() {
    return jwt.sign({
      first_name: this.first_name,
      last_name: this.last_name,
      image_src: this.image_src,
      role: this.role,
    });
  }

  // Saves the employee into the database
  async create() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `INSERT INTO Employee (
          first_name,
          last_name,
          password,
          contact_no,
          email,
          date_employed,
          image_src
        )
        VALUES (
          :first_name, 
          :last_name,
          :password,
          :contact_no,
          :email,
          :date_employed,
          :image_src
        )`,
        this
      );

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

      this.employee_id = data.insertId;
      retVal = this;
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

  // Deactivates account with given employee ID
  async deactivate() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const data = await conn.execute(
        `UPDATE Employee 

        SET 
          is_active = '0'

        WHERE
          employee_id = :employee_id;
        `,
        this
      );
      
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

  static async findByEmail(email) {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute("SELECT * FROM employee WHERE email = :email", { email });

      if (data.length !== 0) retVal = new Employee(data[0]);
    } catch (err) {
      console.log("[EMPLOYEE DB ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  static async findById(employee_id) {
    let retVal = null;

    try {

      
      const conn = await db.connect();
      const [data] = await conn.execute(
        `SELECT *
        FROM Employee
        WHERE employee_id = :employee_id`, {employee_id}
      );
      
      if (data.length !== 0) {
        retVal = new Employee(data[0]);
      }
      
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  } 

  async getEmail(given_email) {
    this.email = given_email;

    try {
      const conn = await db.connect();
      const [data] = await conn.query(
        `SELECT 
          * 

        FROM 
          Supplier 

        WHERE 
          email = ':email'`
        ,this)

        console.log(this.email);
        if (!data[0]) throw new BadRequest();
    
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
      throw new InternalServerError();
    }
  }

  static validate(employee) {
    const schema = Joi.object({
      first_name: Joi.string().label("First Name").min(2).max(300).required(),
      last_name: Joi.string().label("Last Name").min(2).max(300).required(),
      email: Joi.string().label("Email").email().required(),
      contact_no: Joi.string()
        .label("Contact Number")
        .length(11)
        .regex(/^\d{11}$/)
        .message("Contact number must contain digits only."),
      date_employed: Joi.date().label("Date Employed").required(),
      image_src: Joi.string().label("Image Source"),
    });

    return schema.validate(employee);
  }
}

module.exports = Employee;
