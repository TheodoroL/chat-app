import { Link, NavLink } from "react-router";
import { useContext, useState } from "react";
import { AuthContext } from "~/context/AuthController";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthContext não encontrado");
  }

  const { authToken, logout } = context;

  const handleLogout = async () => {
    await logout();
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-blue-400 font-semibold" : "hover:text-gray-300";

  return (
    <header className="bg-zinc-800 text-white shadow-md">
      <div className="flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          Chat App
        </Link>

        {/* Nome do usuário (desktop) */}
        <div className="hidden md:block text-amber-400 text-sm">
          {authToken?.user && `Olá, ${authToken.user.name}!`}
        </div>

        {/* Menu desktop */}
        <nav className="hidden md:flex gap-6 items-center">
          {!authToken ? (
            // Caso NÃO esteja logado
            <>
              <NavLink to="/register" className={linkClass}>
                Cadastrar-se
              </NavLink>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
            </>
          ) : (
            // Caso ESTEJA logado
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition"
            >
              Sair
            </button>
          )}
        </nav>

        {/* Botão mobile */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav className="md:hidden flex flex-col gap-4 px-4 pb-4 border-t border-zinc-700">
          <span className="text-amber-400 text-sm mt-2">
            {authToken?.user ? `Logado como: ${authToken.user.name}` : ""}
          </span>

          {!authToken ? (
            <>
              <NavLink
                to="/register"
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                Cadastrar-se
              </NavLink>
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                Login
              </NavLink>
            </>
          ) : (
            <button
              onClick={async () => {
                setOpen(false);
                await logout();
              }}
              className="text-left text-red-400 hover:text-red-300"
            >
              Sair
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
