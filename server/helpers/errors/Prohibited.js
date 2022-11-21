const HTTPError = require("./HTTPError");

class Prohibited extends HTTPError {
  constructor(message) {
    super(403, message || "You don't have enough permissions to access this resource.");
  }
}

module.exports = Prohibited;
