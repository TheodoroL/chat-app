import { useContext } from "react";
import { Form, redirect } from "react-router";
import { AuthContext } from "~/context/AuthController";

export function meta() {
  return [
    { title: "Cadastro" },
    { name: "description", content: "Página de cadastro de usuários." },
  ];
}

export async function action() {
  return null;
}

export default function Register() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext não encontrado");
  }
  const {
    registerUser,
    updateRegisterInfo,
    createUser,
    isLoading,
    isRegisterError,
  } = context;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <Form
          method="post"
          onSubmit={createUser}
          className="flex flex-col gap-6"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Registrar-se
          </h2>

          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-medium text-gray-700">
              Nome
            </label>
            <input
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              id="name"
              name="name"
              value={registerUser.name}
              onChange={(e) =>
                updateRegisterInfo({ ...registerUser, name: e.target.value })
              }
              placeholder="Seu nome completo"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium text-gray-700">
              Email
            </label>
            <input
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              id="email"
              name="email"
              value={registerUser.email}
              onChange={(e) =>
                updateRegisterInfo({ ...registerUser, email: e.target.value })
              }
              placeholder="seu@email.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-medium text-gray-700">
              Senha
            </label>
            <input
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              id="password"
              name="password"
              value={registerUser.password}
              onChange={(e) =>
                updateRegisterInfo({
                  ...registerUser,
                  password: e.target.value,
                })
              }
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {isRegisterError && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
              {Array.isArray(isRegisterError.message) ? (
                isRegisterError.message.map((msg, index) => (
                  <p key={index} className="text-sm">
                    • {typeof msg === "string" ? msg : "Erro desconhecido"}
                  </p>
                ))
              ) : typeof isRegisterError.message === "string" ? (
                <p className="text-sm">{isRegisterError.message}</p>
              ) : (
                <p className="text-sm">Erro ao processar o registro</p>
              )}
            </div>
          )}

          <button
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold p-3 rounded-lg transition-colors w-full"
            disabled={isLoading}
          >
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </Form>
      </div>
    </div>
  );
}
