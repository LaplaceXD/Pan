const Joi = require("joi");

const { BadRequest, InternalServerError } = require("../../helpers/errors");
const { hash, jwt } = require("../providers");
const { status } = require("../constants/employee");
const Employee = require("../models/employee.model");

const validateAuthBody = (body) => {
  const schema = Joi.object().keys({
    email: Joi.string().label("Email").email().required(),
    password: Joi.any().label("Password").required(),
  });

  return schema.validate(body);
};

const login = async (req, res) => {
  const INVALID_MSG = "Invalid credentials.";

  const { error } = validateAuthBody(req.body);
  if (error) throw new BadRequest(INVALID_MSG);

  const data = await Employee.findByEmail(req.body.email);
  if (!data || data.is_active === status.INACTIVE) throw new BadRequest(INVALID_MSG);

  const passMatch = await hash.compare(req.body.password, data.password);
  if (!passMatch) throw new BadRequest(INVALID_MSG);

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
    throw new InternalServerError(err);
  }
};

module.exports = {
  login,
  logout,
};
