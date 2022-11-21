const hash = require("../../providers/hash");
const Employee = require("../models/employee.model");

const login = async (req, res) => {
  // don't forget to validate email

  const { error, data } = await Employee.findByEmail(req.body.email);
  if (error || !data) res.status(500).send({ error: "Internal Server Error!" });

  if (!hash.compare(req.body.password, data.password)) res.status(400).send("Invalid credentials.");

  const token = data.tokenize();
  res.status(200).send({ token });
};

module.exports = {
  login,
};
