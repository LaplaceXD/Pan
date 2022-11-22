const HTTPError = require("./HTTPError");

class BadRequest extends HTTPError {
  constructor(message) {
    super(400);
    this.message = message;
  }
}

module.exports = BadRequest;
