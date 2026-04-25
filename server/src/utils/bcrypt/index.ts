import { compare, hash } from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return await compare(password, hashedPassword);
}
