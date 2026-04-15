import { useState } from "react";
import { Scissors, Menu, X } from "lucide-react";

interface HeaderProps {
  onBookClick: () => void;
}

const Header = ({ onBookClick }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="py-5 border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Scissors className="w-6 h-6 text-primary" />
          <span className="text-2xl font-heading font-semibold text-primary tracking-tight">
            BarberKing
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#servicos" className="text-sm hover:text-primary transition-colors">
            Serviços
          </a>
          <a href="#agendar" className="text-sm hover:text-primary transition-colors">
            Agendamento
          </a>
          <button
            onClick={onBookClick}
            className="px-6 py-2.5 gold-gradient text-primary-foreground font-medium rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            Agendar
          </button>
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 py-4 border-t border-border space-y-3">
          <a href="#servicos" className="block text-sm hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>
            Serviços
          </a>
          <a href="#agendar" className="block text-sm hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>
            Agendamento
          </a>
          <button
            onClick={() => { onBookClick(); setMenuOpen(false); }}
            className="w-full px-6 py-2.5 gold-gradient text-primary-foreground font-medium rounded-lg text-sm"
          >
            Agendar
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
