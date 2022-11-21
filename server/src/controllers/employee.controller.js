const { BadRequest, InternalServerError } = require("../../helpers/errors");
const { hashPassword } = require("../../providers/hash");
const Employee = require("../models/employee.model");

const create = async (req, res) => {
  const { error: validationError } = Employee.validate(req.body);
  if (validationError)
    throw new BadRequest(
      validationError.details.map((e) => ({ label: e.context.label, message: e.message }))
    );

  const employee = new Employee(req.body);
  employee.password = await hashPassword(employee.password);

  const {
    error,
    data: { password, ...data },
  } = await employee.save();
  if (error) throw new InternalServerError();

  res.status(200).send(data);
};

module.exports = {
  create,
};
