const authRoute = require("./auth.route");
const userRoute = require("./users.route");
const auditRoute = require("./audit.route");
const employeesRoute = require("./employees.route");
const { successResponse } = require("../utils/response");

const initRoutes = (app) => {
  app.get("/health", (req, res) => {
    return successResponse(res, "Health check OK", null);
  });

  app.get("/", (req, res) => {
    const timestamp = new Date().toISOString();
    return successResponse(res, "Welcome to User Management API", {
      timestamp,
    });
  });

  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/employees", employeesRoute);
  app.use("/api/v1/audit", auditRoute);
};

module.exports = initRoutes;
