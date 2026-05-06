import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Pricing = () => {
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("category").order("price");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 w-full">
        <h1 className="text-4xl md:text-5xl font-heading font-semibold text-primary text-center mb-12">
          Tabela de Preços
        </h1>
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          {services?.map((s: any, i: number) => (
            <div key={s.id} className={`flex justify-between items-center p-5 ${i > 0 ? "border-t border-border" : ""}`}>
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{s.category} · {s.duration_minutes} min</p>
              </div>
              <span className="text-primary font-bold text-xl">R${s.price}</span>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
