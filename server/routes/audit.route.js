const express = require("express");
const { protect, allowedRoles } = require("../middleware/protect");
const AuditController = require("../controllers/audit.controllers");

const audit = express.Router();

audit.use(protect, allowedRoles("ADMIN"));

audit.get("/", AuditController.getAuditLogs);

module.exports = audit;
