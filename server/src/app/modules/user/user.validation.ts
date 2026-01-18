import z from "zod";

const createPatientValidationSchema = z.object({
  password: z.string(),
  patient: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().nonempty("Email is required"),
    address: z.string().optional(),
  }),
});

export const createDoctorValidationSchema = z.object({
  password: z.string(),

  doctor: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),

    email: z.string().nonempty("Email is required"),

    contactNumber: z
      .string()
      .min(11, "Contact number must be at least 11 digits"),

    address: z.string().min(5, "Address is required"),

    registrationNumber: z.string().min(3, "Registration number is required"),

    exprience: z
      .number()
      .int()
      .min(0, "Experience cannot be negative")
      .default(0),

    gender: z.enum(["MALE", "FEMALE", "OTHER"]),

    appoinmentFee: z.number().int().min(0, "Appointment fee must be positive"),

    qualification: z.string().min(2, "Qualification is required"),

    currentWorkingPlace: z.string().min(2, "Current working place is required"),

    designation: z.string().min(2, "Designation is required"),
  }),
});

export const createAdminValidationSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),

  admin: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().nonempty("Invalid email address"),
    contactNumber: z
      .string()
      .min(11, "Contact number must be at least 11 digits"),
    profilePhoto: z.string().optional(),
  }),
});

export const UserValidation = {
  createPatientValidationSchema,
  createDoctorValidationSchema,
  createAdminValidationSchema,
};
