const allowFor = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.auth.role))
      return res.status(403).send({ error: "You don't have enough permissions to access this resource." });

    next();
  };
};

module.exports = allowFor;
