import jwt from "jsonwebtoken";
import { env } from "../../env.js";

export function generateJwt(userId: string): string {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "3d" });
}
