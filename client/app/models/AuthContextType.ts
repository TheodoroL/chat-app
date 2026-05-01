import type { LoginFormData } from "./LoginFormData";
import type { MessageErrorResponse } from "./MessageErrorResponse";
import type { RegisterFormData } from "./RegisterFormData";
import type { TokenResponse } from "./TokenResponse";

export interface AuthContextType {
  authToken: TokenResponse | null;
  setAuthToken: (authToken: TokenResponse | null) => void;
  registerUser: RegisterFormData;
  loginData: LoginFormData;
  setLoginData: (data: LoginFormData) => void;
  isAuthenticated: boolean;
  updateRegisterInfo: (info: RegisterFormData) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  isRegisterError: MessageErrorResponse | null;
  createUser: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>;
  loginUser: () => Promise<void>;
}
