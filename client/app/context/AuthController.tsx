import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router";
import type { AuthContextType } from "~/models/AuthContextType";
import type { LoginFormData } from "~/models/LoginFormData";
import type { MessageErrorResponse } from "~/models/MessageErrorResponse";
import type { RegisterFormData } from "~/models/RegisterFormData";
import type { TokenResponse } from "~/models/TokenResponse";
import { API_BASE_URL, postRequest } from "~/utils/serivce";

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
  const navigate = useNavigate();
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

  const logout = useCallback(async (): Promise<void> => {
    setAuthToken(null);
    removeTokenCookie();
    // Limpar dados locais
    setLoginData({ email: "", password: "" });
    setRegisterUser({ name: "", email: "", password: "" });
    setIsRegisterError(null);
    // Redirecionar para login
    navigate("/login");
  }, [navigate]);

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
