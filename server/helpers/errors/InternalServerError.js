const HTTPError = require("./HTTPError");

class InternalServerError extends HTTPError {
  constructor(error = null) {
    super(500, error);
  }
}

module.exports = InternalServerError;
