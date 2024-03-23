const CustomAPIError = require("./custom-error");
const BadRequestError = require("./bad-requst");
const UnauthenticatedError = require("./unauthenticated");
const NotFoundError = require("./not-found");

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
};
