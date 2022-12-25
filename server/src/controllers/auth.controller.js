const Joi = require("joi");

const { BadRequest, Unauthorized } = require("../../helpers/errors");
const { hash, jwt } = require("../providers");

const Employee = require("../models/employee.model");

const validateCredentials = (body) => {
  const schema = Joi.object().keys({
    email: Joi.string().label("Email").email().required(),
    password: Joi.any().label("Password").required(),
  });

  return schema.validate(body);
};

const validateTokenPair = (body) => {
  const schema = Joi.object()
    .keys({
      access: Joi.string().label("Access Token").required(),
      refresh: Joi.string().label("Refresh Token").required(),
    })
    .options({ abortEarly: false });

  return schema.validate(body);
};

const login = async (req, res) => {
  const DEFAULT_INVALID_MSG = "Invalid credentials.";

  const { error } = validateCredentials(req.body);
  if (error) throw new BadRequest(DEFAULT_INVALID_MSG);

  const data = await Employee.findByEmail(req.body.email);
  if (!data || !data.is_active) throw new BadRequest(DEFAULT_INVALID_MSG);

  // const passMatch = await hash.compare(req.body.password, data.password);
  // if (!passMatch) throw new BadRequest(DEFAULT_INVALID_MSG);

  const { access, refresh } = await data.tokenize();
  res.status(200).send({ access, refresh });
};

const refresh = async (req, res) => {
  const { isExpired: accessExpired, isInvalid: accessInvalid } = await jwt.verify(req.body.access);
  const { isExpired: refreshExpired, isInvalid: refreshInvalid } = await jwt.verify(req.body.refresh);

  if (refreshInvalid || accessInvalid) throw new BadRequest("Invalid token pair.");
  else if (refreshExpired) throw new BadRequest("Refresh token expired.");
  else if (!accessExpired) return res.status(200).send(req.body);

  const tokenPair = jwt.TokenPair.from(req.body.access, req.body.refresh);
  if (!tokenPair || (await tokenPair.isBlackListed())) throw new BadRequest("Invalid token pair.");

  const isRefreshed = await tokenPair.isRefreshed();
  if (isRefreshed) {
    await tokenPair.blackList();
    throw new BadRequest("Invalid token pair.");
  }

  // Get the employee, since we want to make sure that the employee was not
  // deleted nor deactivated within the timeframe that the access token expired
  await tokenPair.invalidateRefresh();
  const { id, jti } = tokenPair.payload;
  if (!id || !jti) throw new BadRequest("Invalid access.");

  const data = await Employee.findById(id);
  if (!data || !data.is_active) throw new BadRequest("Invalid access.");

  const { access, refresh } = await data.tokenize(jti);
  res.status(200).send({ access, refresh });
};

const logout = async (req, res) => {
  const { access, refresh } = req.body;
  const authToken = req.get("Authorization").split(" ")[1];
  if (authToken !== access) throw new Unauthorized();

  const { isInvalid: refreshInvalid } = await jwt.verify(refresh);
  if (refreshInvalid) throw new BadRequest("Invalid token pair.");

  const tokenPair = jwt.TokenPair.from(authToken, req.body.refresh);
  if (!tokenPair) throw new BadRequest("Invalid token pair.");

  await tokenPair.invalidateRefresh();
  await tokenPair.blackList();

  res.status(204).send();
};

module.exports = {
  login,
  refresh,
  logout,
  validateTokenPair,
};
