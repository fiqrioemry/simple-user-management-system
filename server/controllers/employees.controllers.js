const { successResponse } = require("../utils/response");
const EmployeesServices = require("../services/employees.services");
const { logAction, ActionType, EntityType } = require("../utils/auditLog");

module.exports = class EmployeesController {
  static async getProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const profile = await EmployeesServices.getProfile(userId);

      return successResponse(res, "Profile fetched successfully", profile);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const userId = req.user.userId;

      const response = await EmployeesServices.updateProfile(userId, req);

      // log audit for profile update
      await logAction({
        userId: userId,
        action: ActionType.UPDATE,
        entity: EntityType.EMPLOYEE,
        entityId: response.employeeId,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        metadata: response.data,
      });

      return successResponse(res, response.message, response.data);
    } catch (error) {
      next(error);
    }
  }
};
