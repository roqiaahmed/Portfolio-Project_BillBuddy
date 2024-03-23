const CustomAPIError = require("./custom-error");
const { StatusCodes } = require("http-status-codes");

class NotFoundError extends CustomAPIError {
  constructor(msg) {
    super(msg);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
module.exports = NotFoundError;
