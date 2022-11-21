const HTTPError = require("./HTTPError");

class NotFound extends HTTPError {
  constructor(message) {
    super(404, message || "Resource not found.");
  }
}

module.exports = NotFound;
