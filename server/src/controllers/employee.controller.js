const Employee = require("../models/employee.model");

const create = async (req, res) => {
  const employee = new Employee(req.body);

  const { error, data } = await employee.save();
  if (error) res.status(500).send({ error: true, status: 500, message: "Internal Server Error!" });

  res.status(200).send({ error: false, status: 200, message: "Employee added successfully!", data });
};

module.exports = {
  create,
};
