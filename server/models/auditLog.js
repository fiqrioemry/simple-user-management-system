"use strict";
const { Model } = require("sequelize");

const ActionType = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
};

const EntityType = {
  USER: "USER",
  EMPLOYEE: "EMPLOYEE",
};

module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    static associate(models) {
      // 1:N AuditLog belongs to User
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  }

  AuditLog.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      action: {
        type: DataTypes.ENUM(...Object.values(ActionType)),
        allowNull: false,
      },
      entity: {
        type: DataTypes.ENUM(...Object.values(EntityType)),
        allowNull: false,
      },
      entityId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "AuditLog",
      tableName: "audit_logs",
      timestamps: true,
      createdAt: true,
      updatedAt: false,
    }
  );

  return AuditLog;
};
