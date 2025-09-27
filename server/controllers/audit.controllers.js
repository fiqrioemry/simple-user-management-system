const { Op } = require("sequelize");
const { AuditLog, User, Employee } = require("../models");
const { successResponse } = require("../utils/response");

module.exports = class AuditController {
  static async getAuditLogs(req, res, next) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      console.log("Query params:", req.query);

      // pagination offset
      const offset = (page - 1) * limit;

      // build where with search
      let where = {};
      if (search) {
        where[Op.or] = [
          { action: { [Op.like]: `%${search}%` } },
          { entity: { [Op.like]: `%${search}%` } },
          { "$user.email$": { [Op.like]: `%${search}%` } },
          { "$user.employee.fullName$": { [Op.like]: `%${search}%` } },
          { "$user.employee.position$": { [Op.like]: `%${search}%` } },
          { "$user.employee.department$": { [Op.like]: `%${search}%` } },
        ];
      }

      // query with join
      const { count, rows: auditLogs } = await AuditLog.findAndCountAll({
        where,
        attributes: [
          "id",
          "userId",
          "action",
          "entity",
          "entityId",
          "metadata",
          "ipAddress",
          "userAgent",
          "createdAt",
        ],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "email", "role"],
            include: [
              {
                model: Employee,
                as: "employee",
                attributes: ["fullName", "department", "position"],
              },
            ],
          },
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["createdAt", "DESC"]],
        subQuery: false,
      });

      // format response
      const auditResponse = auditLogs.map((log) => ({
        id: log.id,
        userId: log.userId,
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        metadata: log.metadata,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        createdAt: log.createdAt,
        user: log.user
          ? {
              id: log.user.id,
              email: log.user.email,
              role: log.user.role,
              fullName: log.user.employee?.fullName,
              department: log.user.employee?.department,
              position: log.user.employee?.position,
            }
          : null, // fallback for safety
      }));

      // send response to client
      return successResponse(res, "Audit logs retrieved successfully", {
        auditLogs: auditResponse,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalRecords: count,
          limit: parseInt(limit),
          hasNext: page * limit < count,
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      next(error);
    }
  }
};
