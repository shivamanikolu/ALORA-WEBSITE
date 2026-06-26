import { z } from "zod";

// Phone validation regex for international formats (allowing leading +, space, dashes, parentheses, digits)
const phoneRegex = /^\+?[0-9\s\-()]{7,25}$/;

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .transform((val) => val.trim()),
  email: z
    .string()
    .email("Invalid email format")
    .max(100, "Email must not exceed 100 characters")
    .transform((val) => val.trim().toLowerCase()),
  phone: z
    .string()
    .refine((val) => phoneRegex.test(val.replace(/\s+/g, "")), {
      message: "Phone number format is invalid",
    }),
  clinic: z
    .string()
    .min(2, "Clinic name must be at least 2 characters")
    .max(150, "Clinic name must not exceed 150 characters")
    .transform((val) => val.trim()),
  type: z
    .string()
    .max(100, "Practice type must not exceed 100 characters")
    .optional()
    .transform((val) => val?.trim() || ""),
  volume: z
    .string()
    .max(100, "Volume description must not exceed 100 characters")
    .optional()
    .transform((val) => val?.trim() || ""),
  locations: z
    .string()
    .max(100, "Locations count description must not exceed 100 characters")
    .optional()
    .transform((val) => val?.trim() || ""),
  challenge: z
    .string()
    .max(2000, "Challenge description must not exceed 2000 characters")
    .optional()
    .transform((val) => val?.trim() || ""),
  timeline: z
    .string()
    .max(100, "Timeline must not exceed 100 characters")
    .optional()
    .transform((val) => val?.trim() || ""),
  additional: z
    .string()
    .max(2000, "Additional information must not exceed 2000 characters")
    .optional()
    .transform((val) => val?.trim() || ""),
  website_honeypot: z
    .string()
    .max(100, "Honeypot value is too long")
    .optional()
    .transform((val) => val || ""),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
