"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("employees", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("(UUID())"),
        primaryKey: true,
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      position: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      photoUrl: Sequelize.STRING,
      department: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hireDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      phone: Sequelize.STRING,
      gender: {
        type: Sequelize.ENUM("MALE", "FEMALE"),
        allowNull: true,
      },
      birthday: Sequelize.DATE,
      address: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE, // paranoid
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("employees");
  },
};
