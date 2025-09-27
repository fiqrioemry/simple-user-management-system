const { z } = require("zod");

const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["ADMIN", "EMPLOYEE"], {
    required_error: "Role is required",
  }),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  phone: z
    .string()
    .regex(/^[+]?[\d\s\-\(\)]+$/, { message: "Invalid phone number" })
    .max(20, "Phone number too long")
    .optional(),
  hireDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid hire date" })
    .optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  birthday: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid birthday" })
    .optional(),
  address: z.string().max(500).optional(),
  photoUrl: z.string().url().optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.enum(["ADMIN", "EMPLOYEE"]).optional(),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  phone: z
    .string()
    .regex(/^[+]?[\d\s\-\(\)]+$/, { message: "Invalid phone number" })
    .max(20, "Phone number too long")
    .optional(),
  hireDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid hire date" })
    .optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  birthday: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid birthday" })
    .optional(),
  address: z.string().max(500).optional(),
  isActive: z.preprocess((val) => val === "true" || val === true).optional(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
};
