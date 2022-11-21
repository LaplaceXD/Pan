const jwt = require("../providers/jwt");

const auth = (req, res, next) => {
  const authValue = req.get("Authorization");
  if (!authValue) return res.status(401).send({ error: "You are unauthorized to access this resource. " });

  const [prefix, token] = authValue.split(" ");
  if (prefix !== "Bearer")
    return res.status(401).send({ error: "You are unauthorized to access this resource." });

  const { error: jwtError, payload } = jwt.verify(token);
  if (jwtError) return res.status(401).send({ error: "You are unauthorized to access this resource." });

  req.auth = payload;
  next();
};

module.exports = auth;
