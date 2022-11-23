const Joi = require("joi");

const { BadRequest } = require("../../helpers/errors");
const { hash, jwt, redis } = require("../providers");
const { status } = require("../constants/employee");
const token = require("../constants/token");

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

  const { token: access, jti } = await data.tokenize();
  const { token: refresh } = await jwt.sign({ jti }, token.REFRESH);
  await redis.set(`jwt_token:${jti}`, refresh);

  res.status(200).send({ token: access });
};

const refresh = async (req, res) => {
  if (!req.body.token) throw new BadRequest("Token is required.");
  else if (typeof req.body.token !== "string") throw new BadRequest("Token must be a string");

  const { isExpired: accessExpired } = await jwt.verify(req.body.token);
  if (!accessExpired) return res.status(200).send({ token: req.body.token });

  const { jti, id } = jwt.decode(req.body.token);
  if (!jti || !id) throw new BadRequest("Invalid token.");

  // Token gets deleted since it would be replaced if it is valid,
  // or would never be used since it is invalid
  const refresh = await redis.getAndDelete(`jwt_token:${jti}`);
  if (!refresh) throw new BadRequest("Refresh token expired.");

  const { isExpired: refreshExpired } = await jwt.verify(refresh);
  if (refreshExpired) throw new BadRequest("Refresh token expired.");

  // Get the employee, since we want to make sure that the employee was not
  // deleted nor deactivated within the timeframe that the access token expired
  const data = await Employee.findById(id);
  if (!data || data.is_active === status.INACTIVE) throw new BadRequest("Invalid token.");

  const { token: newAccess, jti: newJti } = await data.tokenize();
  const { token: newRefresh } = await jwt.sign({ jti: newJti }, token.REFRESH);
  await redis.set(`jwt_token:${newJti}`, newRefresh);

  res.status(200).send({ token: newAccess });
};

module.exports = {
  login,
  refresh,
};
