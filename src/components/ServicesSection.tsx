import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Scissors, Sparkles, Crown } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  corte: <Scissors className="w-6 h-6" />,
  barba: <Sparkles className="w-6 h-6" />,
  combo: <Crown className="w-6 h-6" />,
};

const categoryLabels: Record<string, string> = {
  corte: "Cortes",
  barba: "Barbas",
  combo: "Combos",
};

interface ServicesSectionProps {
  onSelectService: (serviceId: string) => void;
}

const ServicesSection = ({ onSelectService }: ServicesSectionProps) => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("price");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section id="servicos" className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse text-muted-foreground">Carregando serviços...</div>
        </div>
      </section>
    );
  }

  const grouped = (services || []).reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, typeof services>);

  return (
    <section id="servicos" className="py-16 md:py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-heading font-semibold text-primary text-center mb-16">
          Nossos Serviços
        </h2>

        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-primary-foreground">
                {categoryIcons[category]}
              </div>
              <h3 className="text-2xl font-heading font-semibold">
                {categoryLabels[category] || category}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items!.map((service) => (
                <button
                  key={service.id}
                  onClick={() => onSelectService(service.id)}
                  className="text-left p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {service.name}
                    </h4>
                    <span className="text-primary font-bold text-xl">
                      R${service.price}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">
                    {service.description}
                  </p>
                  <span className="text-xs bg-secondary text-primary px-3 py-1 rounded-full font-medium">
                    {service.duration_minutes} min
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
