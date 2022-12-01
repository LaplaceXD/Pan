const { InternalServerError } = require("../../helpers/errors");
const { hash } = require("../providers");
const Employee = require("../models/employee.model");

const create = async (req, res) => {
  const employee = new Employee(req.body);
  employee.password = await hash.hashPassword(employee.password);

  const data = await employee.save();
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

module.exports = {
  create,
};
