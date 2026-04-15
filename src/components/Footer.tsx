import { Scissors } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center space-y-6">
        <div className="flex items-center gap-2">
          <Scissors className="w-5 h-5 text-primary" />
          <span className="text-xl font-heading font-semibold text-primary">
            BarberKing
          </span>
        </div>
        <p className="text-muted-foreground text-center text-sm max-w-md">
          Tradição, estilo e precisão. Agende seu horário e venha viver a experiência.
        </p>
        <p className="text-muted-foreground/50 text-xs">
          © {new Date().getFullYear()} BarberKing. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
