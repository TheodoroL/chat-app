import { Form, redirect } from "react-router";

export function meta() {
  return [
    { title: "Login" },
    { name: "description", content: "This is the login page." },
  ];
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");

  // validação básica

  // chamada para seu backend
  const res = await fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return { error: "Erro ao registrar usuário" };
  }

  // redireciona após sucesso
  return redirect("/login");
}

export default function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Form method="post" className="flex flex-col gap-4 w-80">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            placeholder="exemplo@gmail.com"
            className="p-2 border rounded"
            type="email"
            id="email"
            name="email"
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
          />
        </div>

        <button className="bg-blue-500 text-white p-2 rounded">Entrar</button>
      </Form>
    </div>
  );
}
