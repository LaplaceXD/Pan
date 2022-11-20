const { hashPassword } = require("../../providers/hash");
const Employee = require("../models/employee.model");

const create = async (req, res) => {
  const { error: validationError } = Employee.validate(req.body);
  if (validationError)
    res
      .status(400)
      .send({
        error: true,
        status: 400,
        message: validationError.details.map((e) => ({ label: e.context.label, message: e.message })),
      });

  const employee = new Employee(req.body);
  employee.password = await hashPassword(employee.password);

  const { error, data } = await employee.save();
  if (error) res.status(500).send({ error: true, status: 500, message: "Internal Server Error!" });

  res.status(200).send({ error: false, status: 200, message: "Employee added successfully!", data });
};

module.exports = {
  create,
};
