import * as z from "zod";

export const UserValidation = z.object({
  image: z.string().url().nonempty(),
  id: z.string().nonempty(),
  name: z
    .string()
    .min(3, { message: "Minimum 3 characters." })
    .max(30, { message: "Maximum 30 characters." }),
  username: z
    .string()
    .min(3, { message: "Minimum 3 characters." })
    .max(30, { message: "Maximum 30 characters." }),
  email: z.string().email().optional(),
  bio: z
    .string()
    .min(3, { message: "Minimum 3 characters." })
    .max(1000, { message: "Maximum 1000 characters." })
    .optional(),
});

export const EditUserFormFieldsValidation = UserValidation.omit({
  id: true,
  email: true,
});
