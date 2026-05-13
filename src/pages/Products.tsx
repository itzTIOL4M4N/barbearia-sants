import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShoppingBag } from "lucide-react";

const Products = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("price");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        <h1 className="text-4xl md:text-5xl font-heading font-semibold text-primary text-center mb-4">
          Produtos
        </h1>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Cuidados premium para barba e cabelo, disponíveis para levar para casa.
        </p>

        {isLoading && <p className="text-center text-muted-foreground">Carregando...</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((p: any) => (
            <div key={p.id} className="rounded-xl bg-card border border-border p-6 flex flex-col">
              <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center text-primary-foreground mb-4">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">{p.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{p.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-primary font-bold text-2xl">R${p.price}</span>
                {!p.in_stock && (
                  <span className="text-xs bg-destructive/20 text-destructive px-3 py-1 rounded-full font-medium">
                    Esgotado
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
