"use strict";
const { Model } = require("sequelize");

const Role = {
  ADMIN: "ADMIN",
  EMPLOYEE: "EMPLOYEE",
};

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // 1:1 relations
      this.hasOne(models.Employee, {
        foreignKey: "userId",
        as: "employee",
        onDelete: "CASCADE",
      });

      // 1:N relations
      this.hasMany(models.Session, {
        foreignKey: "userId",
        as: "sessions",
        onDelete: "CASCADE",
      });

      // 1:N relations
      this.hasMany(models.AuditLog, {
        foreignKey: "userId",
        as: "auditLogs",
        onDelete: "CASCADE",
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(...Object.values(Role)),
        defaultValue: Role.EMPLOYEE,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      paranoid: true,
      timestamps: true,
    }
  );

  return User;
};
