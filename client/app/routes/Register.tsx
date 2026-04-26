import { useContext } from "react";
import { Form, redirect } from "react-router";
import { AuthContext } from "~/context/AuthController";

export function meta() {
  return [
    { title: "Register" },
    { name: "description", content: "This is the register page." },
  ];
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();

  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  // validação básica
  if (!username || !email || !password) {
    return { error: "Preencha todos os campos" };
  }

  // chamada para seu backend
  const res = await fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    return { error: "Erro ao registrar usuário" };
  }

  // redireciona após sucesso
  return redirect("/login");
}

export default function Register() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext não encontrado");
  }
  const { registerUser, updateRegisterInfo } = context;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Form method="post" className="flex flex-col gap-4 w-80">
        <h2 className="text-2xl font-bold text-center">Registrar-se</h2>

        <div className="flex flex-col">
          <label htmlFor="username">Nome</label>
          <input
            className="p-2 border rounded"
            type="text"
            id="username"
            name="username"
            value={registerUser.username}
            onChange={(e) =>
              updateRegisterInfo({ ...registerUser, username: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            className="p-2 border rounded"
            type="email"
            id="email"
            name="email"
            value={registerUser.email}
            onChange={(e) =>
              updateRegisterInfo({ ...registerUser, email: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password">Senha</label>
          <input
            className="p-2 border rounded"
            type="password"
            id="password"
            name="password"
            value={registerUser.password}
            onChange={(e) =>
              updateRegisterInfo({ ...registerUser, password: e.target.value })
            }
          />
        </div>

        <button className="bg-blue-500 text-white p-2 rounded">
          Cadastrar
        </button>
      </Form>
    </div>
  );
}
