import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import logo from "@/assets/logo.jpeg";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();

  const links = [
    { to: "/catalogo", label: "Catálogo" },
    { to: "/precos", label: "Preço" },
    { to: "/sobre", label: "Sobre" },
    { to: "/produtos", label: "Produtos" },
    { to: "/agendar", label: "Agendamento" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="py-5 border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Barbearia Sant's" className="w-10 h-10 rounded-full object-cover" />
          <span className="text-2xl font-heading font-semibold text-primary tracking-tight">Barbearia Sant's</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm hover:text-primary transition-colors">{l.label}</Link>
          ))}
          {role === "barbeiro" && (
            <Link to="/barbeiro" className="text-sm text-primary font-semibold">Painel</Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="flex items-center gap-1 text-sm hover:text-primary">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          ) : (
            <Link to="/auth/cliente" className="flex items-center gap-1 px-4 py-2 gold-gradient text-primary-foreground font-medium rounded-lg text-sm">
              <UserIcon className="w-4 h-4" /> Entrar
            </Link>
          )}
        </nav>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 py-4 border-t border-border space-y-3">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="block text-sm hover:text-primary">{l.label}</Link>
          ))}
          {role === "barbeiro" && (
            <Link to="/barbeiro" onClick={() => setOpen(false)} className="block text-sm text-primary font-semibold">Painel</Link>
          )}
          {user ? (
            <button onClick={() => { handleLogout(); setOpen(false); }} className="block text-sm">Sair</button>
          ) : (
            <Link to="/auth/cliente" onClick={() => setOpen(false)} className="block text-sm text-primary">Entrar</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
