import { z, ZodType } from "zod";
import { PHONE_REGEX } from "../settings/constant";

export class ContactValidation {
  static readonly CREATE: ZodType = z.object({
    first_name: z.string().min(1).max(100),
    last_name: z.string().min(1).max(100).optional(),
    email: z.string().email().min(1).max(100).optional(),
    phone: z
      .string()
      .min(1)
      .max(20)
      .refine(
        (val) => {
          return val.match(PHONE_REGEX);
        },
        { message: "phone number is invalid" }
      )
      .optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    first_name: z.string().min(1).max(100).optional(),
    last_name: z.string().min(1).max(100).optional(),
    email: z.string().email().min(1).max(100).optional(),
    phone: z
      .string()
      .min(1)
      .max(20)
      .refine(
        (val) => {
          return val.match(PHONE_REGEX);
        },
        { message: "phone number is invalid" }
      )
      .optional(),
  });
}
