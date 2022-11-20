const Joi = require("joi");
const db = require("../../providers/db");

class Employee {
  constructor(employee) {
    this.id = employee.id || 0;
    this.firstName = employee.firstName;
    this.lastName = employee.lastName;
    this.password = employee.password || "";
    this.contactNo = employee.contactNo;
    this.email = employee.email;
    this.dateEmployed = employee.dateEmployed;
    this.imageSrc = employee.imageSrc;
    this.role = employee.role || "employee";
    this.isActive = employee.isActive || true;
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
          :firstName, 
          :lastName,
          :password,
          :contactNo,
          :email,
          :dateEmployed,
          :imageSrc
        )`,
        this
      );

      console.log(data);
      resp.data = data.insertId;
    } catch (err) {
      console.log("[EMPLOYEE ERROR]", err.message);
      resp.error = err.message;
    }

    return resp;
  }

  static validate(employee) {
    const schema = Joi.object({
      firstName: Joi.string().label("First Name").min(2).max(300).required(),
      lastName: Joi.string().label("Last Name").min(2).max(300).required(),
      password: Joi.string()
        .label("Password")
        .min(8)
        .max(32)
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$/)
        .message(
          "Password must have at least one uppercase letter, one lowercase letter, a special character, and a number."
        ),
      email: Joi.string().label("Email").email().required(),
      contactNo: Joi.string()
        .label("Contact Number")
        .length(11)
        .regex(/^\d{11}$/)
        .message("Contact number must contain digits only."),
      dateEmployed: Joi.date().label("Date Employed").required(),
      imageSrc: Joi.string().label("Image Source"),
    });

    return schema.validate(employee);
  }
}

module.exports = Employee;
