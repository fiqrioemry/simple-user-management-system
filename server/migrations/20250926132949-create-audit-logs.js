"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("audit_logs", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("(UUID())"),
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      action: {
        type: Sequelize.ENUM(
          "LOGIN",
          "LOGOUT",
          "CREATE",
          "UPDATE",
          "DELETE",
          "UPLOAD_PHOTO"
        ),
        allowNull: false,
      },
      entity: {
        type: Sequelize.ENUM("USER", "EMPLOYEE", "SESSION"),
        allowNull: false,
      },
      entityId: Sequelize.STRING,
      metadata: Sequelize.JSON,
      ipAddress: Sequelize.STRING,
      userAgent: Sequelize.STRING,
      createdAt: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("audit_logs");
  },
};
