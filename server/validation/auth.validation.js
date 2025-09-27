const { z } = require("zod");

// login schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password is required" }),
});

// change password schema
const changePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

module.exports = {
  loginSchema,
  changePasswordSchema,
};
