import { Link, NavLink } from "react-router";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-blue-400 font-semibold" : "hover:text-gray-300";

  return (
    <header className="bg-zinc-800 text-white shadow-md">
      <div className="flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          Chat App
        </Link>

        {/* Status (desktop) */}
        <div className="hidden md:block text-amber-400 text-sm">
          Teste está logado
        </div>

        {/* Menu desktop */}
        <nav className="hidden md:flex gap-6 items-center">
          {/* <NavLink to="/" className={linkClass}>
            Home
          </NavLink> */}
          <NavLink to="/register" className={linkClass}>
            Cadastrar-se
          </NavLink>
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
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
          <span className="text-amber-400 text-sm">Teste está logado</span>
          {/* 
          {/* <NavLink to="/" onClick={() => setOpen(false)} className={linkClass}>
            Home
          </NavLink> */}
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
        </nav>
      )}
    </header>
  );
}
