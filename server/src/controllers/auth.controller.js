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
  const INVALID_MSG = "Invalid credentials.";

  const { error } = validateAuthBody(req.body);
  if (error) throw new BadRequest(INVALID_MSG);

  const data = await Employee.findByEmail(req.body.email);
  if (!data || data.is_active === status.INACTIVE) throw new BadRequest(INVALID_MSG);

  const passMatch = await hash.compare(req.body.password, data.password);
  if (!passMatch) throw new BadRequest(INVALID_MSG);

  // create rotating tokens
  const { token: access, jti } = await data.tokenize();
  const { token: refresh } = await jwt.sign({ jti }, token.REFRESH);

  const client = redis.connect();
  await client.set(`jwt_token:${jti}`, refresh);

  res.status(200).send({ token: access });
};

const refresh = async (req, res) => {
  if (!req.body.token) throw new BadRequest("Token is required.");
  else if (typeof req.body.token !== "string") throw new BadRequest("Token must be a string");

  const { isExpired: accessIsExpired } = await jwt.verify(req.body.token);
  if (!accessIsExpired) return res.status(200).send({ token: req.body.token });

  const { jti, exp, aud, iss, iat, ...payload } = jwt.decode(req.body.token);
  if (!jti) throw new BadRequest("Invalid token.");

  // check redis cache for existence
  const client = redis.connect();

  const refresh = await client.get(`jwt_token:${jti}`);
  if (!refresh) throw new BadRequest("Invalid token.");
  await client.del(`jwt_token:${jti}`);

  const { isExpired: refreshIsExpired } = await jwt.verify(refresh);
  if (refreshIsExpired) throw new BadRequest("Invalid token.");

  const { token: newAccess, jti: newJti } = await jwt.sign(payload, token.ACCESS);
  const { token: newRefresh } = await jwt.sign(newJti, token.REFRESH);

  await client.set(`jwt_token:${newJti}`, newRefresh);
  res.status(200).send({ token: newAccess });
};

module.exports = {
  login,
  refresh,
};
