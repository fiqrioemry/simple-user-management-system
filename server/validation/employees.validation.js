const { z } = require("zod");

const updateEmployeeSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters")
    .optional(),
  position: z
    .string()
    .min(2, "Position must be at least 2 characters")
    .max(100, "Position must be at most 100 characters")
    .optional(),
  department: z
    .string()
    .min(2, "Department must be at least 2 characters")
    .max(100, "Department must be at most 100 characters")
    .optional(),
  phone: z
    .string()
    .regex(/^[+]?[\d\s\-\(\)]+$/, { message: "Invalid phone number format" })
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be at most 20 digits")
    .optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  birthday: z
    .preprocess(
      (val) => (val ? new Date(val) : undefined),
      z.date().max(new Date(), { message: "Birthday cannot be in the future" })
    )
    .optional(),
  address: z
    .string()
    .max(500, "Address must be at most 500 characters")
    .optional(),
});

module.exports = {
  updateEmployeeSchema,
};
