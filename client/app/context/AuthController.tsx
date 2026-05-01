import { createContext, useCallback, useState, type ReactNode } from "react";
import { API_BASE_URL, postRequest } from "~/utils/serivce";

interface User {
  id?: string;
  name: string;
  email?: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

interface TokenResponse {
  token: string;
}
interface MessageErrorResponse {
  message: string | string[];
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  registerUser: RegisterFormData;
  isAuthenticated: boolean;
  updateRegisterInfo: (info: RegisterFormData) => void;
  logout: () => void;
  isLoading: boolean;
  isRegisterError: MessageErrorResponse | null;
  createUser: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({
  children,
}: AuthContextProviderProps): ReactNode {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegisterError, setIsRegisterError] =
    useState<MessageErrorResponse | null>(null);

  const [registerUser, setRegisterUser] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
  });

  const updateRegisterInfo = useCallback((info: RegisterFormData) => {
    setRegisterUser(info);
  }, []);

  const createUser = useCallback(
    async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      setIsRegisterError(null);

      try {
        const response = await postRequest<TokenResponse, RegisterFormData>(
          `${API_BASE_URL}/users/register`,
          registerUser,
        );

        const { token } = response;
        localStorage.setItem("authToken", token);

        // Limpar form após sucesso
        setRegisterUser({ name: "", email: "", password: "" });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao registrar";

        try {
          const errorObj = JSON.parse(errorMessage);

          // Extrair mensagem seguindo a interface MessageErrorResponse
          let message: string | string[] = "Erro desconhecido";

          if (errorObj.error && Array.isArray(errorObj.error)) {
            // Array de objetos Zod
            const msgs = errorObj.error.map((issue: any) => issue.message);
            message = msgs.length > 0 ? msgs : "Erro na validação";
          } else if (typeof errorObj.error === "string") {
            message = errorObj.error;
          } else if (typeof errorObj.message === "string") {
            message = errorObj.message;
          }

          setIsRegisterError({ message });
        } catch {
          setIsRegisterError({ message: errorMessage });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [registerUser],
  );

  const isAuthenticated = user !== null;

  const logout = (): void => setUser(null);

  const value: AuthContextType = {
    user,
    setUser,
    registerUser,
    isAuthenticated,
    updateRegisterInfo,
    logout,
    isLoading,
    createUser,
    isRegisterError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
