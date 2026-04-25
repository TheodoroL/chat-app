import { Link, useLocation } from "react-router";

export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-2xl font-bold">
      <h1> 404 - Página não encontrada</h1>

      <p className="text-base font-normal text-gray-500">
        URL: {pathname}
      </p>

      <Link to="/login" className="text-blue-500 underline">
        voltar para o login
      </Link>
    </div>
  );
}
