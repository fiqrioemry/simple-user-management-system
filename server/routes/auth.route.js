const {
  loginSchema,
  changePasswordSchema,
} = require("../validation/auth.validation");
const express = require("express");
const validate = require("../middleware/validation");
const { protect } = require("../middleware//protect");
const AuthController = require("../controllers/auth.controllers");

const auth = express.Router();

auth.get("/get-session", protect, AuthController.getSession);

auth.post("/login", validate(loginSchema), AuthController.login);

auth.post("/logout", protect, AuthController.logout);

auth.post(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  AuthController.changePassword
);

module.exports = auth;
