const HTTPError = require("./HTTPError");
const BadRequest = require("./BadRequest");
const Unauthorized = require("./Unauthorized");
const Prohibited = require("./Prohibited");
const NotFound = require("./NotFound");
const InternalServerError = require("./InternalServerError");

module.exports = {
  BadRequest,
  Unauthorized,
  Prohibited,
  NotFound,
  InternalServerError,
  HTTPError,
};
