const jwt = require("jsonwebtoken");
const HttpError = require("../utils/httpError");

const protect = async (req, res, next) => {
  // get token from http only cookie
  const token = req.cookies.sessionToken;

  try {
    // if no token thow error
    if (!token) throw new HttpError(401, "Unauthorized. Please log in.");

    // verify jwt token
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          throw new HttpError(401, "Token expired");
        } else {
          throw new HttpError(403, "Forbidden Access");
        }
      }
      // assign user to req object
      req.user = decode;
      next();
    });
  } catch (error) {
    next(error);
  }
};

const allowedRoles = (...roles) => {
  return (req, res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      throw new HttpError(403, "Forbidden Access");
    }
    next();
  };
};

module.exports = { protect, allowedRoles };
