import { Instagram, MapPin } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center space-y-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Barbearia Sant's" className="w-10 h-10 rounded-full object-cover" />
          <span className="text-xl font-heading font-semibold text-primary">
            Barbearia Sant's
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Instagram className="w-4 h-4 text-primary" />
            <a
              href="https://www.instagram.com/barbeariasants__/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary hover:underline"
            >
              barbeariasants__
            </a>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Rua José Lagrange 34a</span>
          </div>
        </div>
        <p className="text-muted-foreground text-center text-sm max-w-md">
          Tradição, estilo e precisão. Agende seu horário e venha viver a experiência.
        </p>
        <p className="text-muted-foreground/50 text-xs">
          © {new Date().getFullYear()} Barbearia Sant's. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
