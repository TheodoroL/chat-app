import type { User } from "./User";

export interface TokenResponse {
  token: string;
  user: User;
}
