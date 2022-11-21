const { BadRequest } = require("../../helpers/errors");
const { hash } = require("../../providers");
const Employee = require("../models/employee.model");

const login = async (req, res) => {
  // don't forget to validate email

  const data = await Employee.findByEmail(req.body.email);
  if (!data || !hash.compare(req.body.password, data.password))
    throw new BadRequest("Invalid credentials.");

  const token = data.tokenize();
  res.status(200).send({ token });
};

module.exports = {
  login,
};
