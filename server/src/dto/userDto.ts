import { z } from "zod";

export const RegisterUserDto = z.object({
  name: z.string().min(3).max(30),
  email: z.email(),
  password: z.string().min(6),
});

export const LoginUserDto = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const GetUserDto = z.object({
  id: z.string().min(1),
});

export type UserDtoType = z.infer<typeof RegisterUserDto>;
export type LoginUserDtoType = z.infer<typeof LoginUserDto>;
export type RegisterUserDtoType = z.infer<typeof RegisterUserDto>;
