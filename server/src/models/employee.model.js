const Joi = require("joi");
const db = require("../../providers/db");
const { status, role } = require("../../constants/employee");

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

  // Saves the employee into the database
  async save() {
    const resp = { error: null, data: null };

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
      resp.data = this;
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
      resp.error = err.message;
    }

    return resp;
  }

  static async findByEmail(email) {
    const resp = { error: null, data: null };

    try {
      const conn = await db.connect();
      const [data] = await conn.execute("SELECT * FROM employee WHERE email = :email", { email });

      if (data.length !== 0) resp.data = data[0];
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
      resp.error = err.message;
    }

    return resp;
  }

  static validate(employee) {
    const schema = Joi.object({
      first_name: Joi.string().label("First Name").min(2).max(300).required(),
      last_name: Joi.string().label("Last Name").min(2).max(300).required(),
      password: Joi.string()
        .label("Password")
        .min(8)
        .max(32)
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$/)
        .message(
          "Password must have at least one uppercase letter, one lowercase letter, a special character, and a number."
        ),
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
