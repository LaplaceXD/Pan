const HTTPError = require("./HTTPError");

class Unauthorized extends HTTPError {
  constructor(message) {
    super(401, message || "You are unauthorized to access this resource.");
  }
}

module.exports = Unauthorized;
