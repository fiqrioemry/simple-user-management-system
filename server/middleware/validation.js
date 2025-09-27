module.exports = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err.errors) {
      // map error to specific format
      const formattedErrors = err.errors.map((e) => ({
        field: `body.${e.path.join(".")}`,
        message: e.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: formattedErrors,
      });
    }

    // fallback if not a Zod error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
