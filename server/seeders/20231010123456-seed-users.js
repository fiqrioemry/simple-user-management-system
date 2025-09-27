"use strict";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash("password123", 10);

    // Generate user IDs
    const adminId = uuidv4();
    const employeeId = uuidv4();

    // Insert users
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: adminId,
          email: "admin@example.com",
          password: passwordHash,
          role: "ADMIN",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: employeeId,
          email: "employee@example.com",
          password: passwordHash,
          role: "EMPLOYEE",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Insert employees (linked with users)
    await queryInterface.bulkInsert(
      "employees",
      [
        {
          id: uuidv4(),
          fullName: "Super Admin",
          position: "System Administrator",
          department: "Management",
          hireDate: new Date("2023-01-01"),
          userId: adminId,
          phone: "081111111111",
          gender: "MALE",
          birthday: new Date("1990-01-01"),
          address: "Jl. Admin Utama No.1, Jakarta",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          fullName: "John Doe",
          position: "Software Engineer",
          department: "IT",
          hireDate: new Date("2023-01-01"),
          userId: employeeId,
          phone: "081234567890",
          gender: "MALE",
          birthday: new Date("1995-05-20"),
          address: "Jl. Contoh No.123, Jakarta",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("employees", {
      fullName: ["Super Admin", "John Doe"],
    });

    await queryInterface.bulkDelete("users", {
      email: ["admin@example.com", "employee@example.com"],
    });
  },
};
