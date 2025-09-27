const bcrypt = require("bcrypt");
const HttpError = require("../utils/httpError");
const { generateRandom } = require("../utils/generate");
const { sendEmailPassword } = require("../utils/sendEmail");
const { sequelize, User, Employee } = require("../models");
const { Op } = require("sequelize");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

module.exports = class UsersServices {
  static async getAll(userId, queryParams) {
    const { page = 1, limit = 10, search } = queryParams;

    // pagination offset
    const offset = (page - 1) * limit;

    // fetch users with employees
    const { count, rows: users } = await User.findAndCountAll({
      where: {
        [Op.or]: [
          { email: { [Op.like]: `%${search}%` } },
          { "$employee.fullname$": { [Op.like]: `%${search}%` } },
          { "$employee.position$": { [Op.like]: `%${search}%` } },
          { "$employee.department$": { [Op.like]: `%${search}%` } },
        ],
      },
      include: [
        {
          model: Employee,
          as: "employee",
        },
      ],
      attributes: { exclude: ["password"] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    const usersResponse = users.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      profile: user?.employee,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      canDelete: user.id !== userId,
    }));

    return {
      users: usersResponse,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalUsers: count,
        limit: parseInt(limit),
        hasNext: page * limit < count,
        hasPrev: page > 1,
      },
    };
  }

  static async create(req) {
    const {
      email,
      name,
      role,
      position,
      department,
      phone,
      hireDate,
      gender,
      birthday,
      address,
    } = req.body;

    // start transaction to prevent roll back
    const transaction = await sequelize.transaction();

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new HttpError(400, "User already exists");
      }

      // Handle photo upload if file not null
      let photoUrl = null;
      if (req.file?.buffer) {
        const uploaded = await uploadToCloudinary(
          req.file.buffer,
          req.file.mimetype
        );
        photoUrl = uploaded.secure_url;
      }

      //  Generate random password
      const plainPassword = generateRandom(8);
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // create user
      const user = await User.create(
        {
          email,
          password: hashedPassword,
          role: role || "EMPLOYEE",
          isActive: true,
        },
        { transaction }
      );

      // create employee profile
      const newEmployee = await Employee.create(
        {
          userId: user.id,
          fullName: name,
          position,
          department,
          phone,
          gender,
          hireDate,
          birthday,
          address,
          photoUrl,
        },
        { transaction }
      );

      //  commit transaction
      await transaction.commit();

      // Send password email
      await sendEmailPassword(email, plainPassword);

      return {
        message: "User created successfully",
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          profile: newEmployee,
        },
      };
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  static async update(req) {
    const { id } = req.params;
    const {
      name,
      role,
      position,
      department,
      phone,
      hireDate,
      gender,
      birthday,
      address,
      isActive,
    } = req.body;

    // start transaction to prevent roll back
    const transaction = await sequelize.transaction();

    try {
      // get user from db
      const user = await User.findByPk(id, {
        include: [{ model: Employee, as: "employee" }],
      });
      if (!user) throw new HttpError(404, "User not found");

      // update user info
      await user.update(
        {
          role: role || user.role,
          isActive,
        },
        { transaction }
      );

      // update employee profile
      if (user.employee) {
        await user.employee.update(
          {
            fullName: name || user.employee.fullName,
            position: position || user.employee.position,
            department: department || user.employee.department,
            phone: phone || user.employee.phone,
            gender: gender || user.employee.gender,
            hireDate: hireDate || user.employee.hireDate,
            birthday: birthday || user.employee.birthday,
            address: address || user.employee.address,
          },
          { transaction }
        );
      }

      await transaction.commit();

      return {
        message: "User updated successfully",
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          profile: user?.employee,
        },
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async delete(userId) {
    // get user by id
    const user = await User.findByPk(userId, {
      include: [{ model: Employee, as: "employee" }],
      attributes: { exclude: ["password"] },
    });
    if (!user) throw new HttpError(404, "User not found");

    // delete user
    await user.destroy();

    return {
      data: user,
      message: "User deleted successfully",
    };
  }
};
