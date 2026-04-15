import { Scissors } from "lucide-react";

interface HeroSectionProps {
  onBookClick: () => void;
}

const HeroSection = ({ onBookClick }: HeroSectionProps) => {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Scissors className="w-5 h-5 text-primary" />
          <span className="text-primary text-sm uppercase tracking-[0.3em] font-semibold">
            Barbearia Premium
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight mb-6">
          Estilo & Tradição.
          <br />
          <span className="text-gold-gradient">Um Corte Acima.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mb-10">
          A arte da barbearia tradicional com toques modernos. Agende seu
          horário e descubra o melhor de você.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onBookClick}
            className="gold-gradient px-8 py-4 text-primary-foreground font-semibold rounded-lg text-lg hover:opacity-90 transition-opacity"
          >
            Agendar Agora
          </button>
          <a
            href="#servicos"
            className="px-8 py-4 border border-primary text-primary font-semibold rounded-lg text-lg hover:bg-primary/10 transition-colors text-center"
          >
            Ver Serviços
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
