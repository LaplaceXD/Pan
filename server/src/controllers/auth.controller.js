const Joi = require("joi");

const { BadRequest } = require("../../helpers/errors");
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
  const DEFAULT_INVALID_MSG = "Invalid credentials.";

  const { error } = validateAuthBody(req.body);
  if (error) throw new BadRequest(DEFAULT_INVALID_MSG);

  const data = await Employee.findByEmail(req.body.email);
  if (!data || data.is_active === status.INACTIVE) throw new BadRequest(DEFAULT_INVALID_MSG);

  const passMatch = await hash.compare(req.body.password, data.password);
  if (!passMatch) throw new BadRequest(DEFAULT_INVALID_MSG);

  const token = await data.tokenize();
  await token.save();

  res.status(200).send({ token: token.access });
};

const refresh = async (req, res) => {
  if (!req.body.token) throw new BadRequest("Token is required.");
  else if (typeof req.body.token !== "string") throw new BadRequest("Token must be a string");

  const { isExpired: accessExpired } = await jwt.verify(req.body.token);
  if (!accessExpired) return res.status(200).send({ token: req.body.token });

  const oldToken = await jwt.fromAccessToken(req.body.token);
  if (!oldToken) throw new BadRequest("Invalid token.");

  const isRefreshable = await oldToken.isRefreshable();
  if (!isRefreshable) throw new BadRequest("Refresh token expired.");

  // Get the employee, since we want to make sure that the employee was not
  // deleted nor deactivated within the timeframe that the access token expired
  const { id } = oldToken.credentials();
  if (!id) throw new BadRequest("Invalid token.");

  const data = await Employee.findById(id);
  if (!data || data.is_active === status.INACTIVE) throw new BadRequest("Invalid token.");

  const token = await data.tokenize();
  await oldToken.delete();
  await token.save();

  res.status(200).send({ token: token.access });
};

module.exports = {
  login,
  refresh,
};
