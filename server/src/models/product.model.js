const Joi = require("joi");

const { InternalServerError } = require("../../helpers/errors");

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

  async tokenize() {
    try {
      return await jwt.fromPayload({
        id: this.employee_id,
        first_name: this.first_name,
        last_name: this.last_name,
        role: this.role,
      });
    } catch (err) {
      console.log("[JWT ERROR]", err);
      throw new InternalServerError(err);
    }
  }

  // Saves the employee into the database
  async save() {
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
      console.log("[EMPLOYEE DB ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
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
