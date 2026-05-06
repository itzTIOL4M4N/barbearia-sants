import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, DollarSign, CheckCircle2, XCircle } from "lucide-react";

const BarberDashboard = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));

  useEffect(() => {
    if (!loading && (!user || role !== "barbeiro")) navigate("/auth/barbeiro");
  }, [user, role, loading, navigate]);

  const { data: appointments } = useQuery({
    queryKey: ["all-appointments"],
    enabled: role === "barbeiro",
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*, services(name, price)")
        .order("appointment_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Atualizado");
      queryClient.invalidateQueries({ queryKey: ["all-appointments"] });
    },
  });

  const monthAppts = (appointments || []).filter((a: any) =>
    a.appointment_date.startsWith(month) && a.status === "concluido"
  );
  const monthTotal = monthAppts.reduce((sum: number, a: any) => sum + Number(a.services?.price || 0), 0);
  const upcoming = (appointments || []).filter((a: any) =>
    a.status === "agendado" && new Date(a.appointment_date) >= new Date()
  );

  const serviceTotals = monthAppts.reduce((acc: any, a: any) => {
    const name = a.services?.name || "—";
    acc[name] = (acc[name] || 0) + Number(a.services?.price || 0);
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl md:text-4xl font-heading font-semibold text-primary mb-8">
          Painel do Barbeiro
        </h1>

        {/* Resumo mensal */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-heading font-semibold">Resumo Mensal</h2>
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)}
              className="px-4 py-2 rounded-lg bg-card border border-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-6 rounded-xl bg-card border border-border">
              <DollarSign className="w-6 h-6 text-primary mb-2" />
              <p className="text-3xl font-bold text-primary">R$ {monthTotal.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Faturamento concluído</p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <CheckCircle2 className="w-6 h-6 text-primary mb-2" />
              <p className="text-3xl font-bold">{monthAppts.length}</p>
              <p className="text-sm text-muted-foreground">Atendimentos concluídos</p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <Calendar className="w-6 h-6 text-primary mb-2" />
              <p className="text-3xl font-bold">{upcoming.length}</p>
              <p className="text-sm text-muted-foreground">Próximos agendamentos</p>
            </div>
          </div>

          {Object.keys(serviceTotals).length > 0 && (
            <div className="rounded-xl bg-card border border-border overflow-hidden">
              <div className="p-4 border-b border-border font-semibold">Por serviço</div>
              {Object.entries(serviceTotals).map(([name, total]: any) => (
                <div key={name} className="flex justify-between p-4 border-t border-border first:border-t-0">
                  <span>{name}</span>
                  <span className="text-primary font-bold">R$ {Number(total).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Agenda */}
        <section>
          <h2 className="text-xl font-heading font-semibold mb-4">Agenda</h2>
          <div className="space-y-3">
            {appointments?.map((a: any) => (
              <div key={a.id} className="p-4 rounded-xl bg-card border border-border flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="font-semibold">{a.customer_name} <span className="text-muted-foreground text-sm">· {a.customer_phone}</span></p>
                  <p className="text-sm text-muted-foreground">
                    {a.services?.name} · {new Date(a.appointment_date).toLocaleString("pt-BR")} · R${a.services?.price}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${
                    a.status === "concluido" ? "bg-primary/20 text-primary" :
                    a.status === "cancelado" ? "bg-destructive/20 text-destructive" :
                    "bg-secondary text-foreground"
                  }`}>{a.status}</span>
                  {a.status === "agendado" && (
                    <>
                      <button onClick={() => updateStatus.mutate({ id: a.id, status: "concluido" })}
                        className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20" title="Concluir">
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => updateStatus.mutate({ id: a.id, status: "cancelado" })}
                        className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20" title="Cancelar">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {appointments?.length === 0 && (
              <p className="text-center text-muted-foreground py-8">Nenhum agendamento ainda.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BarberDashboard;
