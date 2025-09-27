require("dotenv").config;
const jwt = require("jsonwebtoken");

const generateSessionToken = (user, expiresIn = "7d") => {
  if (!user || !user.id) {
    throw new Error("User object must contain an id.");
  }

  const sessionToken = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn }
  );

  return sessionToken;
};

const setSessionToken = (res, sessionToken) => {
  res.cookie("sessionToken", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

module.exports = {
  generateSessionToken,
  setSessionToken,
};
