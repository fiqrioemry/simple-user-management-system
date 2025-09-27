class HttpError extends Error {
  constructor(status, message, code = "ERROR", errors = null) {
    super(message);
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

module.exports = HttpError;
