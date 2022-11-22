const { BadRequest, InternalServerError } = require("../../helpers/errors");
const { hash, jwt } = require("../providers");
const Employee = require("../models/employee.model");

const login = async (req, res) => {
  // don't forget to validate email

  const data = await Employee.findByEmail(req.body.email);
  if (!data || !hash.compare(req.body.password, data.password))
    throw new BadRequest("Invalid credentials.");

  const token = await data.tokenize();
  res.status(200).send({ token });
};

const logout = async (req, res) => {
  const token = req.get("Authorization").split(" ")[1];

  try {
    await jwt.destroy(token);
    res.status(204).send();
  } catch (err) {
    console.log("[JWT ERROR]", err);
    throw InternalServerError(err);
  }
};

module.exports = {
  login,
  logout,
};
