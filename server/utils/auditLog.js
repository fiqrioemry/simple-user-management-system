const { AuditLog } = require("../models");

const logAction = async ({
  userId,
  action,
  entity,
  entityId = null,
  metadata = {},
  ipAddress = null,
  userAgent = null,
}) => {
  try {
    await AuditLog.create({
      userId,
      action,
      entity,
      entityId,
      metadata,
      ipAddress,
      userAgent,
    });
  } catch (err) {
    console.error("Failed to write audit log:", err.message);
  }
};

const ActionType = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
};

const EntityType = {
  USER: "USER",
  EMPLOYEE: "EMPLOYEE",
};

module.exports = { logAction, ActionType, EntityType };
