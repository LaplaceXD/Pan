const config = require("config");
const jwt = require("jsonwebtoken");
const hash = require("../../providers/hash");
const Employee = require("../models/employee.model");

const login = async (req, res) => {
  // don't forget to validate email

  const { error, data } = await Employee.findByEmail(req.body.email);
  if (error) res.status(500).send({ error: "Internal Server Error!" });

  if (!hash.compare(req.body.password, data.password)) res.status(400).send("Invalid credentials.");

  const token = jwt.sign(
    {
      first_name: data.first_name,
      last_name: data.last_name,
      image_src: data.image_src,
      role: data.role,
    },
    config.get("jwtSecret")
  );

  res.status(200).send({ token });
};

module.exports = {
  login,
};
