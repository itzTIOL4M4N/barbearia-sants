import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { CalendarIcon, Clock, User, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Booking = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [params] = useSearchParams();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState(params.get("service") || "");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate("/auth/cliente");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("full_name, phone").eq("user_id", user.id).maybeSingle()
        .then(({ data }) => {
          if (data) {
            setName(data.full_name || "");
            setPhone(data.phone || "");
          }
        });
    }
  }, [user]);

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("price");
      if (error) throw error;
      return data;
    },
  });

  const { data: myAppointments } = useQuery({
    queryKey: ["my-appointments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*, services(name, price)")
        .eq("user_id", user!.id)
        .order("appointment_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("appointments").insert({
        user_id: user!.id,
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        service_id: serviceId,
        appointment_date: new Date(date).toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Agendamento confirmado!", {
        description: "Você receberá uma confirmação. Aguardamos você!",
      });
      setDate("");
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
    },
    onError: (e: any) => toast.error(e.message || "Erro ao agendar"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !serviceId || !date) {
      toast.error("Preencha todos os campos");
      return;
    }
    mutation.mutate();
  };

  const selected = services?.find((s) => s.id === serviceId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        <h1 className="text-4xl md:text-5xl font-heading font-semibold text-primary text-center mb-12">
          Agende Seu Horário
        </h1>

        <form onSubmit={handleSubmit} className="p-8 rounded-xl bg-card border border-border space-y-5 mb-12">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <User className="w-4 h-4 text-primary" /> Nome
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Phone className="w-4 h-4 text-primary" /> Telefone
            </label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Clock className="w-4 h-4 text-primary" /> Serviço
            </label>
            <select value={serviceId} onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none">
              <option value="">Selecione...</option>
              {services?.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name} — R${s.price}</option>
              ))}
            </select>
          </div>
          {selected && (
            <div className="px-4 py-3 rounded-lg bg-secondary/50 border border-primary/20 text-sm">
              <span className="text-primary font-semibold">{selected.name}</span> · {selected.duration_minutes} min · <span className="text-primary font-bold">R${selected.price}</span>
            </div>
          )}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <CalendarIcon className="w-4 h-4 text-primary" /> Data e Horário
            </label>
            <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <button type="submit" disabled={mutation.isPending}
            className="w-full py-4 gold-gradient text-primary-foreground font-semibold rounded-lg text-lg hover:opacity-90 disabled:opacity-50">
            {mutation.isPending ? "Agendando..." : "Confirmar Agendamento"}
          </button>
        </form>

        {myAppointments && myAppointments.length > 0 && (
          <div>
            <h2 className="text-2xl font-heading font-semibold mb-4">Meus Agendamentos</h2>
            <div className="space-y-3">
              {myAppointments.map((a: any) => (
                <div key={a.id} className="p-4 rounded-lg bg-card border border-border flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{a.services?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(a.appointment_date).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${
                    a.status === "concluido" ? "bg-primary/20 text-primary" :
                    a.status === "cancelado" ? "bg-destructive/20 text-destructive" :
                    "bg-secondary text-foreground"
                  }`}>{a.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
