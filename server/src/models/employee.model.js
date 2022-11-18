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
    this.isActive = employee.isActive || 1;
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
}

module.exports = Employee;