const { HTTPError, InternalServerError } = require("../../helpers/errors");

const error = (err, _req, res, _next) => {
  if (err instanceof InternalServerError) {
    res.status(err.status).send({ error: "Internal Server Error." });
    console.log(err);
  } else if (err instanceof HTTPError) {
    res.status(err.status).send({ error: err.message });
    console.log("[ERROR]", err.message);
  } else {
    console.log("[ERROR]", err.message);
  }
};

module.exports = error;
