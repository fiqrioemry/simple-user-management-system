// Success response utility
const successResponse = (
  res,
  message,
  data = null,
  status = 200,
  meta = null
) => {
  const response = {
    success: true,
    message,
    data,
    status,
    ...(meta && { meta }),
  };
  return res.status(status).json(response);
};

// Error response utility
const errorResponse = (
  res,
  message,
  status = 500,
  code = "INTERNAL_SERVER_ERROR",
  errors = null
) => {
  const response = {
    success: false,
    message,
    status,
    code,
    ...(errors && { errors }),
  };
  return res.status(status).json(response);
};

// Paginated response utility
const paginatedResponse = (res, message, data, page, limit, total) => {
  const pagination = {
    page: parseInt(page),
    limit: parseInt(limit),
    totalItems: total,
    totalPages: Math.ceil(total / limit),
    offset: (page - 1) * limit,
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  };

  return successResponse(res, message, data, 200, { pagination });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
};
