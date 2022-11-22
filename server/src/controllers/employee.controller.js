const { BadRequest, InternalServerError } = require("../../helpers/errors");
const { hash } = require("../providers");
const Employee = require("../models/employee.model");

const create = async (req, res) => {
  const { error: validationError } = Employee.validate(req.body);
  if (validationError)
    throw new BadRequest(
      validationError.details.map((e) => ({ label: e.context.label, message: e.message }))
    );

  const employee = new Employee(req.body);
  employee.password = await hash.hashPassword(employee.password);

  const data = await employee.save();
  if (!data) throw new InternalServerError();

  res.status(200).send(data);
};

module.exports = {
  create,
};
