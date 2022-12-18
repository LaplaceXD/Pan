const { HTTPError, InternalServerError } = require("../../helpers/errors");

const error = (err, _req, res, _next) => {
  if (err instanceof InternalServerError) {
    res.status(err.status).send({ message: "Internal Server Error." });
    console.log(err);
  } else if (err instanceof HTTPError) {
    res.status(err.status).send({ message: err.message });
    console.log("[REQUEST ERROR]", err.message);
  } else {
    console.log("[ERROR]", err);
  }
};

module.exports = error;
