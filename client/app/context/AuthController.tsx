import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { API_BASE_URL, postRequest } from "~/utils/serivce";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface User {
  name: string;
  email: string;
}

interface TokenResponse {
  token: string;
  user: User;
}
interface MessageErrorResponse {
  message: string | string[];
}

interface AuthContextType {
  authToken: TokenResponse | null;
  setAuthToken: (authToken: TokenResponse | null) => void;
  registerUser: RegisterFormData;
  loginData: LoginFormData;
  setLoginData: (data: LoginFormData) => void;
  isAuthenticated: boolean;
  updateRegisterInfo: (info: RegisterFormData) => void;
  logout: () => void;
  isLoading: boolean;
  isRegisterError: MessageErrorResponse | null;
  createUser: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>;
  loginUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthContextProviderProps {
  children: ReactNode;
}

// Helper para salvar token em cookie
function setTokenCookie(token: string) {
  if (typeof document !== "undefined") {
    document.cookie = `authToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 dias
  }
}

// Helper para remover cookie
function removeTokenCookie() {
  if (typeof document !== "undefined") {
    document.cookie = `authToken=; path=/; max-age=0`;
  }
}

export function AuthContextProvider({
  children,
}: AuthContextProviderProps): ReactNode {
  const [authToken, setAuthToken] = useState<TokenResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegisterError, setIsRegisterError] =
    useState<MessageErrorResponse | null>(null);

  const [registerUser, setRegisterUser] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Verificar se tem token no cookie ao carregar (apenas no cliente)
    if (typeof document !== "undefined") {
      const token = document.cookie
        .split(";")
        .find((c) => c.trim().startsWith("authToken="))
        ?.split("=")[1];

      if (token) {
        setAuthToken({ token, user: { name: "", email: "" } });
      }
    }
  }, []);

  console.log(authToken);
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

        const { token, user } = response;
        setAuthToken({ token, user: { name: user.name, email: user.email } });
        // Salvar em cookie ao invés de localStorage
        setTokenCookie(token);

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

  const loginUser = useCallback(async () => {
    setIsLoading(true);
    setIsRegisterError(null);

    try {
      const response = await postRequest<TokenResponse, LoginFormData>(
        `${API_BASE_URL}/users/login`,
        loginData,
      );

      const { token, user } = response;
      setAuthToken({ token, user });
      setTokenCookie(token);

      // Limpar form após sucesso
      setLoginData({ email: "", password: "" });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao fazer login";

      try {
        const errorObj = JSON.parse(errorMessage);

        let message: string | string[] = "Erro desconhecido";

        if (errorObj.error && Array.isArray(errorObj.error)) {
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
  }, [loginData]);

  const isAuthenticated = authToken !== null;

  const logout = (): void => {
    setAuthToken(null);
    removeTokenCookie();
  };

  const value: AuthContextType = {
    authToken,
    setAuthToken,
    registerUser,
    loginData,
    setLoginData,
    isAuthenticated,
    updateRegisterInfo,
    logout,
    isLoading,
    createUser,
    loginUser,
    isRegisterError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
