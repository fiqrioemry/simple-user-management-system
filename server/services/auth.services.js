const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const redis = require("../config/redis");
const HttpError = require("../utils/httpError");
const { User, Employee, Session } = require("../models");
const { setSessionToken, generateSessionToken } = require("../utils/jwt");

module.exports = class AuthServices {
  static async login(req, res) {
    const { email, password } = req.body;

    // check if user exist
    const user = await User.findOne({
      where: { email },
      include: [{ model: Employee, as: "employee" }],
    });

    if (!user) throw new HttpError(401, "invalid email");

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new HttpError(401, "invalid password");

    // generate tokens
    const sessionToken = generateSessionToken(user);

    // save cookies
    await Session.create({
      userId: user.id,
      token: sessionToken,
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // set cookie as https only cookies
    setSessionToken(res, sessionToken);

    const userResponse = {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.employee && {
        id: user.employee.id,
        userId: user.employee.userId,
        name: user.employee.fullName,
        photoUrl: user.employee.photoUrl,
      },
      createdAt: user?.createdAt,
    };

    return userResponse;
  }

  static async logout(res, userId) {
    // delete sesion from db
    await Session.destroy({ where: { userId } });

    // clear cookie from browser
    res.clearCookie("sessionToken");

    return "logout successfully";
  }

  static async getSession(userId) {
    const user = await User.findByPk(userId, {
      include: [{ model: Employee, as: "employee" }],
    });

    if (!user) throw new HttpError(404, "User not found");

    const userResponse = {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.employee && {
        id: user.employee.id,
        userId: user.employee.userId,
        name: user.employee.fullName,
        photoUrl: user.employee.photoUrl,
      },
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };

    return userResponse;
  }

  static async changePassword(userId, req) {
    const { oldPassword, newPassword } = req.body;

    // check if user exist
    const user = await User.findByPk(userId);
    if (!user) throw new HttpError(404, "User not found");

    // compare the old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new HttpError(401, "password invalid");

    // hash new password before update
    const hashed = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashed });

    // delete all session
    await Session.destroy({ where: { userId } });

    return "Password changed successfully";
  }
};
