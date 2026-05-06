import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Scissors, Sparkles, Crown, FlaskConical } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const icons: Record<string, React.ReactNode> = {
  corte: <Scissors className="w-6 h-6" />,
  barba: <Sparkles className="w-6 h-6" />,
  combo: <Crown className="w-6 h-6" />,
  quimica: <FlaskConical className="w-6 h-6" />,
};
const labels: Record<string, string> = {
  corte: "Cortes", barba: "Barbas", combo: "Combos", quimica: "Químicas",
};

const Catalog = () => {
  const navigate = useNavigate();
  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("price");
      if (error) throw error;
      return data;
    },
  });

  const grouped = (services || []).reduce((acc: any, s: any) => {
    (acc[s.category] ||= []).push(s); return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        <h1 className="text-4xl md:text-5xl font-heading font-semibold text-primary text-center mb-12">
          Catálogo de Serviços
        </h1>
        {isLoading && <p className="text-center text-muted-foreground">Carregando...</p>}
        {Object.entries(grouped).map(([cat, items]: any) => (
          <div key={cat} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-primary-foreground">
                {icons[cat]}
              </div>
              <h2 className="text-2xl font-heading font-semibold">{labels[cat] || cat}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((s: any) => (
                <button key={s.id} onClick={() => navigate(`/agendar?service=${s.id}`)}
                  className="text-left p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold">{s.name}</h4>
                    <span className="text-primary font-bold text-xl">R${s.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{s.description}</p>
                  <span className="text-xs bg-secondary text-primary px-3 py-1 rounded-full font-medium">
                    {s.duration_minutes} min
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;
