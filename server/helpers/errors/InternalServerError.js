const HTTPError = require("./HTTPError");

class InternalServerError extends HTTPError {
  constructor(message) {
    super(500, message || "Internal Server Error.");
  }
}

module.exports = InternalServerError;
