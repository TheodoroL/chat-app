import { redirect } from "react-router";

export async function protectedLoader() {
  // Verifica se existe token no localStorage
  const token = localStorage.getItem("authToken");

  // Se não tiver token, redireciona para login
  if (!token) {
    return redirect("/login");
  }

  // Se tiver token, permite acessar a rota
  return { token };
}

export async function publicLoader() {
  // Se já estiver autenticado, redireciona para home
  const token = localStorage.getItem("authToken");

  if (token) {
    return redirect("/");
  }

  return null;
}
