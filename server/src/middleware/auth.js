const { jwt } = require("../providers");
const { Unauthorized } = require("../../helpers/errors");

const auth = async (req, _, next) => {
  const authValue = req.get("Authorization");
  if (!authValue) throw new Unauthorized();

  const [prefix, token] = authValue.split(" ");
  if (prefix !== "Bearer") throw new Unauthorized();

  try {
    const { payload, isExpired, isInvalid } = await jwt.verify(token);
    if (isExpired || isInvalid || (await jwt.blackList.contains(payload.jti))) throw new Unauthorized();

    req.auth = payload;
    next();
  } catch (err) {
    console.log("[JWT ERROR]", err);
    throw new Unauthorized();
  }
};

module.exports = auth;
