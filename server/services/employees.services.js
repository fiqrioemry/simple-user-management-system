const bcrypt = require("bcrypt");
const HttpError = require("../utils/httpError");
const { sequelize, User, Employee } = require("../models");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

module.exports = class EmployeesServices {
  static async getProfile(userId) {
    const user = await User.findByPk(userId, {
      include: [{ model: Employee, as: "employee" }],
      attributes: { exclude: ["password"] },
    });

    if (!user) throw new HttpError(404, "User not found");

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      profile: user.employee,
      createdAt: user.createdAt,
    };
  }

  static async updateProfile(userId, req) {
    const { fullName, position, department, phone, gender, birthday, address } =
      req.body;

    // start transaction to prevent roll back
    const transaction = await sequelize.transaction();

    try {
      //  Find user and employee
      const user = await User.findByPk(userId, {
        include: [{ model: Employee, as: "employee" }],
      });

      if (!user) throw new HttpError(404, "User not found");

      //  Handle photo upload
      let photoUrl = user.employee.photoUrl;
      if (req.file?.buffer) {
        const uploaded = await uploadToCloudinary(
          req.file.buffer,
          req.file.mimetype
        );
        photoUrl = uploaded.secure_url;
      }

      //  update employee profile
      await user.employee.update(
        {
          fullName: fullName || user.employee.fullName,
          position: position || user.employee.position,
          department: department || user.employee.department,
          phone: phone || user.employee.phone,
          gender: gender || user.employee.gender,
          birthday: birthday || user.employee.birthday,
          address: address || user.employee.address,
          photoUrl,
        },
        { transaction }
      );

      await transaction.commit();

      return {
        message: "Profile updated successfully",
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user?.employee,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
