const { errorResponse } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const code = err.code || "INTERNAL_SERVER_ERROR";
  const errors = err.errors || null;

  return errorResponse(res, message, status, code, errors);
};

const notFoundHandler = (req, res, next) => {
  return errorResponse(res, "Route not found", 404, "NOT_FOUND");
};

module.exports = { errorHandler, notFoundHandler };
