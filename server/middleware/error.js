const { HTTPError } = require("../helpers/errors");

const error = (err, req, res, next) => {
  if (err instanceof HTTPError) {
    res.status(err.status).send({ error: err.message });
  }
};

module.exports = error;
