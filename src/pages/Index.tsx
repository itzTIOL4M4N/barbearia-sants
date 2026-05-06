import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { Scissors, DollarSign, Info, Calendar } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const cards = [
    { to: "/catalogo", icon: <Scissors />, title: "Catálogo", desc: "Cortes, barbas e químicas" },
    { to: "/precos", icon: <DollarSign />, title: "Preço", desc: "Tabela completa de valores" },
    { to: "/sobre", icon: <Info />, title: "Sobre", desc: "Conheça a barbearia" },
    { to: "/agendar", icon: <Calendar />, title: "Agendamento", desc: "Marque seu horário" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection onBookClick={() => navigate("/agendar")} />
        <section className="px-6 pb-20 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c) => (
              <button key={c.to} onClick={() => navigate(c.to)}
                className="text-left p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group">
                <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-primary-foreground mb-4">
                  {c.icon}
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2 group-hover:text-primary">{c.title}</h3>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
              </button>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
