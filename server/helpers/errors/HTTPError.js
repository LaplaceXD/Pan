class HTTPError {
  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}

module.exports = HTTPError;
