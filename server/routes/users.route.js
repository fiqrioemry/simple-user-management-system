const express = require("express");
const { upload } = require("../middleware/media");
const validate = require("../middleware/validation");
const { protect, allowedRoles } = require("../middleware/protect");
const UsersController = require("../controllers/users.controllers");
const {
  createUserSchema,
  updateUserSchema,
} = require("../validation/users.validation");

const users = express.Router();

users.use(protect, allowedRoles("ADMIN"));

users.get("", UsersController.getUsers);

users.post(
  "",
  upload().single("photoUrl"),
  validate(createUserSchema),
  UsersController.createUsers
);

users.put("/:id", UsersController.updateUsers);

users.delete("/:id", UsersController.deleteUsers);

module.exports = users;
