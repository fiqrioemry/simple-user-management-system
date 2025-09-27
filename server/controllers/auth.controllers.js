const { logAction, ActionType, EntityType } = require("../utils/auditLog");
const { successResponse } = require("../utils/response");
const AuthServices = require("../services/auth.services");

module.exports = class AuthController {
  static async login(req, res, next) {
    try {
      const response = await AuthServices.login(req, res);

      // Log audit for login
      await logAction({
        userId: response.id,
        action: ActionType.LOGIN,
        entity: EntityType.USER,
        entityId: response.id,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        metadata: { response },
      });

      return successResponse(res, "login success", response, 200);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      const userId = req.user.userId;
      const message = await AuthServices.logout(res, userId);

      // log audit for logout
      await logAction({
        userId: userId,
        action: ActionType.LOGOUT,
        entity: EntityType.USER,
        entityId: userId,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        metadata: null,
      });

      return successResponse(res, message);
    } catch (error) {
      next(error);
    }
  }

  static async getSession(req, res, next) {
    try {
      const userId = req.user.userId;
      const response = await AuthServices.getSession(userId);
      return successResponse(res, "get session success", response, 200);
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const userId = req.user.userId;
      const message = await AuthServices.changePassword(userId, req);

      // log auudit for password change
      await logAction({
        userId: userId,
        action: ActionType.UPDATE,
        entity: EntityType.USER,
        entityId: userId,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        metadata: null,
      });

      return successResponse(res, message);
    } catch (error) {
      next(error);
    }
  }
};
