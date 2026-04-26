import { createContext, useCallback, useState, type ReactNode } from "react";

interface User {
  id?: string;
  name: string;
  email?: string;
}

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  registerUser: RegisterFormData;
  isAuthenticated: boolean;
  updateRegisterInfo: (info: RegisterFormData) => void;
  logout: () => void;
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
  const [registerUser, setRegisterUser] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
  });

  console.log(registerUser);
  const updateRegisterInfo = useCallback((info: RegisterFormData) => {
    setRegisterUser(info);
  }, []);

  const isAuthenticated = user !== null;

  const logout = (): void => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    setUser,
    registerUser,
    isAuthenticated,
    updateRegisterInfo,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
