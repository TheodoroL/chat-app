import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "~/context/AuthController";

export function meta() {
  return [
    { title: "Login" },
    { name: "description", content: "This is the login page." },
  ];
}

export default function Login() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error("AuthContext não encontrado");
  }

  const {
    loginData,
    setLoginData,
    loginUser,
    isLoading,
    isRegisterError,
    authToken,
  } = context;

  useEffect(() => {
    if (authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginUser();
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {isRegisterError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {Array.isArray(isRegisterError.message) ? (
              <ul>
                {isRegisterError.message.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            ) : (
              <p>{isRegisterError.message}</p>
            )}
          </div>
        )}

        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            placeholder="exemplo@gmail.com"
            className="p-2 border rounded"
            type="email"
            id="email"
            name="email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password">Senha</label>
          <input
            placeholder="********"
            className="p-2 border rounded"
            type="password"
            id="password"
            name="password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
