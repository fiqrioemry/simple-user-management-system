const express = require("express");
const { upload } = require("../middleware/media");
const { protect } = require("../middleware/protect");
const validate = require("../middleware/validation");
const EmployeesController = require("../controllers/employees.controllers");
const { updateEmployeeSchema } = require("../validation/employees.validation");

const employees = express.Router();

employees.use(protect);

employees.get("/profile", EmployeesController.getProfile);
employees.put(
  "/profile",
  upload().single("photoUrl"),
  validate(updateEmployeeSchema),
  EmployeesController.updateProfile
);

module.exports = employees;
