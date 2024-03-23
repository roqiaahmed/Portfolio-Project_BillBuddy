const customAPIError = require("./custom-error");
const { StatusCodes } = require("http-status-codes");

class BadRequestError extends customAPIError {
  constructor(msg) {
    super(msg);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
module.exports = BadRequestError;
