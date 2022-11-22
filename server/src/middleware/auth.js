const { jwt } = require("../providers");
const { Unauthorized } = require("../../helpers/errors");

const auth = (req, _, next) => {
  const authValue = req.get("Authorization");
  if (!authValue) throw new Unauthorized();

  const [prefix, token] = authValue.split(" ");
  if (prefix !== "Bearer") throw new Unauthorized();

  const { error: jwtError, payload } = jwt.verify(token);
  if (jwtError) throw new Unauthorized();

  req.auth = payload;
  next();
};

module.exports = auth;
