const { successResponse } = require("../utils/response");
const UsersServices = require("../services/users.services");
const { logAction, ActionType, EntityType } = require("../utils/auditLog");

module.exports = class UsersController {
  static async getUsers(req, res, next) {
    try {
      const userId = req.user.userId;
      const queryParams = req.query;

      const users = await UsersServices.getAll(userId, queryParams);

      return successResponse(res, "User fetched successfully", users);
    } catch (error) {
      next(error);
    }
  }

  static async createUsers(req, res, next) {
    try {
      const response = await UsersServices.create(req);

      // Log audit for user creation
      await logAction({
        userId: req.user.userId, // Admin who created the user
        action: ActionType.CREATE,
        entity: EntityType.USER,
        entityId: response.data.id,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        metadata: {
          createdUser: {
            email: response.data.email,
            role: response.data.role,
          },
          adminAction: true,
        },
      });

      return successResponse(res, response.message, response.data, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateUsers(req, res, next) {
    try {
      const userId = req.params.id;
      const response = await UsersServices.update(req);

      // Log audit for user update
      await logAction({
        userId: req.user.userId,
        action: ActionType.UPDATE,
        entity: EntityType.USER,
        entityId: userId,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        metadata: {
          updatedFields: req.body,
          targetUser: {
            id: userId,
            email: response.data.email,
            role: response.data.role,
          },
          adminAction: true,
        },
      });

      return successResponse(res, response.message, response.data);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUsers(req, res, next) {
    try {
      const userId = req.params.id;

      const response = await UsersServices.delete(userId);

      // Log audit for user deletion
      await logAction({
        userId: req.user.userId,
        action: ActionType.DELETE,
        entity: EntityType.USER,
        entityId: userId,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        metadata: response.data,
      });

      return successResponse(res, response.message);
    } catch (error) {
      next(error);
    }
  }
};
