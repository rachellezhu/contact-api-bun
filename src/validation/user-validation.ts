import { password } from "bun";
import { z, ZodType } from "zod";

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(1).max(100),
    full_name: z.string().min(1).max(100),
    password: z
      .string()
      .min(1)
      .max(100)
      .refine(
        (val) => {
          return val.match(/^(?=.*[a-zA-Z])(?=.*[0-9])/);
        },
        { message: "password must contain alphanumeric" }
      ),
  });

  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(1).max(100),
    password: z
      .string()
      .min(1)
      .max(100)
      .refine(
        (val) => {
          return val.match(/^(?=.*[a-zA-Z])(?=.*[0-9])/);
        },
        { message: "username or password is invalid" }
      ),
  });

  static readonly TOKEN: ZodType = z.string().min(1);

  static readonly UPDATE: ZodType = z.object({
    full_name: z.string().min(1).max(100).optional(),
    password: z
      .string()
      .min(1)
      .max(100)
      .refine(
        (val) => {
          return val.match(/^(?=.*[a-zA-Z])(?=.*[0-9])/);
        },
        { message: "password must contain alphanumeric" }
      )
      .optional(),
    token: this.TOKEN,
  });
}
