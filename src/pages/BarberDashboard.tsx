import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, DollarSign, CheckCircle2, XCircle, Phone, User, Clock, FileText } from "lucide-react";

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
        .select("*, services(name, price, duration_minutes, category)")
        .order("appointment_date", { ascending: true });
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

  const now = new Date();
  const upcoming = (appointments || [])
    .filter((a: any) => a.status === "agendado" || a.status === "pendente")
    .filter((a: any) => new Date(a.appointment_date) >= new Date(now.getTime() - 86400000))
    .sort((a: any, b: any) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime());

  const serviceTotals = monthAppts.reduce((acc: any, a: any) => {
    const name = a.services?.name || "—";
    if (!acc[name]) acc[name] = { count: 0, total: 0 };
    acc[name].count += 1;
    acc[name].total += Number(a.services?.price || 0);
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl md:text-4xl font-heading font-semibold text-primary mb-8">
          Painel do Barbeiro
        </h1>

        <Tabs defaultValue="agenda" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="agenda">
              <Calendar className="w-4 h-4 mr-2" /> Agendamentos
            </TabsTrigger>
            <TabsTrigger value="resumo">
              <DollarSign className="w-4 h-4 mr-2" /> Resumo Mensal
            </TabsTrigger>
          </TabsList>

          {/* Agendamentos */}
          <TabsContent value="agenda">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-heading font-semibold">Próximos Agendamentos</h2>
              <span className="text-sm text-muted-foreground">{upcoming.length} agendado(s)</span>
            </div>

            <div className="space-y-3">
              {upcoming.map((a: any) => {
                const d = new Date(a.appointment_date);
                return (
                  <div key={a.id} className="p-5 rounded-xl bg-card border border-border">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          <p className="font-semibold text-lg">{a.customer_name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                            a.status === "agendado" ? "bg-primary/20 text-primary" : "bg-secondary text-foreground"
                          }`}>{a.status}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" /> {a.customer_phone}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {d.toLocaleDateString("pt-BR")} às {d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-sm">
                          <span className="font-medium">{a.services?.name}</span>
                          <span className="text-muted-foreground"> · {a.services?.duration_minutes}min · </span>
                          <span className="text-primary font-semibold">R$ {Number(a.services?.price || 0).toFixed(2)}</span>
                        </p>
                        {a.notes && (
                          <p className="text-sm text-muted-foreground flex items-start gap-1.5 pt-1">
                            <FileText className="w-3.5 h-3.5 mt-0.5" /> {a.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex md:flex-col gap-2">
                        <button onClick={() => updateStatus.mutate({ id: a.id, status: "concluido" })}
                          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4" /> Concluir
                        </button>
                        <button onClick={() => updateStatus.mutate({ id: a.id, status: "cancelado" })}
                          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 text-sm font-medium">
                          <XCircle className="w-4 h-4" /> Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {upcoming.length === 0 && (
                <p className="text-center text-muted-foreground py-12">Nenhum agendamento no momento.</p>
              )}
            </div>
          </TabsContent>

          {/* Resumo Mensal */}
          <TabsContent value="resumo">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-heading font-semibold">Resumo Mensal</h2>
              <input type="month" value={month} onChange={(e) => setMonth(e.target.value)}
                className="px-4 py-2 rounded-lg bg-card border border-border" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-6 rounded-xl bg-card border border-border">
                <DollarSign className="w-6 h-6 text-primary mb-2" />
                <p className="text-3xl font-bold text-primary">R$ {monthTotal.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Faturamento do mês</p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <CheckCircle2 className="w-6 h-6 text-primary mb-2" />
                <p className="text-3xl font-bold">{monthAppts.length}</p>
                <p className="text-sm text-muted-foreground">Atendimentos concluídos</p>
              </div>
            </div>

            {Object.keys(serviceTotals).length > 0 ? (
              <div className="rounded-xl bg-card border border-border overflow-hidden">
                <div className="p-4 border-b border-border font-semibold">Por serviço</div>
                {Object.entries(serviceTotals).map(([name, info]: any) => (
                  <div key={name} className="flex justify-between p-4 border-t border-border first:border-t-0">
                    <span>{name} <span className="text-muted-foreground text-sm">· {info.count}x</span></span>
                    <span className="text-primary font-bold">R$ {Number(info.total).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">Nenhum atendimento concluído neste mês.</p>
            )}

            <div className="mt-8">
              <h3 className="text-lg font-heading font-semibold mb-3">Atendimentos concluídos no mês</h3>
              <div className="space-y-2">
                {monthAppts.map((a: any) => {
                  const d = new Date(a.appointment_date);
                  return (
                    <div key={a.id} className="p-4 rounded-lg bg-card border border-border flex justify-between items-center">
                      <div>
                        <p className="font-medium">{a.customer_name} <span className="text-muted-foreground text-sm">· {a.services?.name}</span></p>
                        <p className="text-xs text-muted-foreground">{d.toLocaleString("pt-BR")}</p>
                      </div>
                      <span className="text-primary font-semibold">R$ {Number(a.services?.price || 0).toFixed(2)}</span>
                    </div>
                  );
                })}
                {monthAppts.length === 0 && (
                  <p className="text-center text-muted-foreground py-6 text-sm">Sem registros neste mês.</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default BarberDashboard;
