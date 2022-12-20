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
    this.date_employed = employee.date_employed || new Date();
    this.image_src = employee.image_src || "";
    this.role = employee.role || role.EMPLOYEE;
    this.is_active = employee.is_active
      ? employee.is_active === true || employee.is_active === status.ACTIVE
      : true;
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

  // Saves the employee into the database
  async save() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `INSERT INTO employee (first_name, last_name, password, contact_no, email, date_employed)
        VALUES (:first_name, :last_name, :password, :contact_no, :email, :date_employed)`,
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
  async update(details) {
    let retVal = null;
    const editedEmployee = { ...this, ...details };

    try {
      const conn = await db.connect();
      await conn.execute(
        `UPDATE employee 
        SET 
          first_name = :first_name,
          last_name = :last_name,
          contact_no = :contact_no,
          email = :email,
          date_employed = :date_employed
        WHERE
          employee_id = :employee_id
        `,
        editedEmployee
      );

      await conn.end();
      retVal = new Employee(editedEmployee);
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
      throw new InternalServerError();
    }

    return retVal;
  }

  // Saves the value of the password to db
  async savePassword() {
    try {
      const conn = await db.connect();
      await conn.execute(
        `UPDATE employee 
        SET 
          password = :password
        WHERE
          employee_id = :employee_id;
        `,
        this
      );

      await conn.end();
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
      throw new InternalServerError();
    }
  }

  // Deactivates/Activates an account with given employee ID
  async toggleStatus() {
    try {
      const is_active = this.is_active ? status.INACTIVE : status.ACTIVE;

      const conn = await db.connect();
      await conn.execute(`UPDATE employee SET is_active = :is_active WHERE employee_id = :employee_id`, {
        ...this,
        is_active,
      });

      await conn.end();
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
      throw new InternalServerError();
    }
  }

  // Displays all employee data
  static async findAll() {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.query(`SELECT * FROM employee`);
      await conn.end();

      retVal = data.map((d) => new Employee(d));
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
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

  static async validate(employee, params = {}, auth = {}) {
    let match = "email" in employee ? await Employee.findByEmail(employee.email) : null;
    const isEditing = "id" in params;
    const isEditingOwnAccount = isEditing && parseInt(params.id) === match?.employee_id;
    const isManagerRole = "role" in auth && auth.role === role.MANAGER;

    let schema = {
      first_name: Joi.string().label("First Name").min(2).max(300).required().trim(),
      last_name: Joi.string().label("Last Name").min(2).max(300).required().trim(),
      email: Joi.string()
        .label("Email")
        .email()
        .not(!isEditingOwnAccount && match ? match.email : "")
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
    };

    if (isManagerRole || !isEditing) {
      schema = {
        ...schema,
        date_employed: Joi.date().label("Date Employed").max("now").iso().required(),
      };
    }

    schema = Joi.object().keys(schema).options({ abortEarly: false });
    return schema.validate(employee);
  }

  static async validatePassword(body) {
    const schema = Joi.object()
      .keys({
        current_password: Joi.string().label("Current Password").required(),
        new_password: Joi.string()
          .label("New Password")
          .min(8)
          .max(16)
          .regex(/\d/)
          .message("{{#label}} must contain a digit.")
          .regex(/[A-Z]/)
          .message("{{#label}} must contain an uppercase letter.")
          .regex(/[a-z]/)
          .message("{{#label}} must contain a lowercase letter.")
          .regex(/[!@#$%^&*]/)
          .message("{{#label}} must contain a special character (!@#$%^&*).")
          .required(),
      })
      .options({ abortEarly: false });

    return schema.validate(body);
  }
}

module.exports = Employee;
