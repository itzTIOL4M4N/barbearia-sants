import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { CalendarIcon, Clock, User, Phone } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// 9:00 até 19:30, de 30 em 30 min
const TIME_SLOTS = Array.from({ length: 22 }, (_, i) => {
  const total = 9 * 60 + i * 30;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
});

const Booking = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [params] = useSearchParams();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState(params.get("service") || "");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");

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

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("appointments").update({ status: "cancelado" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Agendamento desmarcado");
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
    },
    onError: (e: any) => toast.error(e.message || "Erro ao desmarcar"),
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const [hh, mm] = time.split(":").map(Number);
      const d = new Date(date!);
      d.setHours(hh, mm, 0, 0);
      const { error } = await supabase.from("appointments").insert({
        user_id: user!.id,
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        service_id: serviceId,
        appointment_date: d.toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Agendamento confirmado!", {
        description: "Você receberá uma confirmação. Aguardamos você!",
      });
      setDate(undefined);
      setTime("");
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
    },
    onError: (e: any) => toast.error(e.message || "Erro ao agendar"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !serviceId || !date || !time) {
      toast.error("Preencha todos os campos");
      return;
    }
    const day = date.getDay(); // 0=Dom, 1=Seg, 2=Ter..6=Sab
    if (day === 0 || day === 1) {
      toast.error("Atendemos somente de terça a sábado");
      return;
    }
    const [hh, mm] = time.split(":").map(Number);
    const slotMin = hh * 60 + mm;
    if (slotMin < 9 * 60 || slotMin > 19 * 60 + 30) {
      toast.error("Horário disponível das 9h às 19h30");
      return;
    }
    const [h, m] = time.split(":").map(Number);
    const chosen = new Date(date);
    chosen.setHours(h, m, 0, 0);
    if (chosen.getTime() <= Date.now()) {
      toast.error("Escolha um horário futuro");
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

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <CalendarIcon className="w-4 h-4 text-primary" /> Data
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button"
                    className={cn(
                      "w-full px-4 py-3 rounded-lg bg-background border border-border text-left flex items-center justify-between hover:border-primary/60 transition",
                      !date && "text-muted-foreground"
                    )}>
                    {date ? format(date, "PPP", { locale: ptBR }) : "Selecione a data"}
                    <CalendarIcon className="w-4 h-4 opacity-60" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white text-slate-900 border border-slate-200 shadow-xl" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={ptBR}
                    initialFocus
                    disabled={(d) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      if (d < today) return true;
                      const wd = d.getDay();
                      return wd === 0 || wd === 1; // bloqueia Dom e Seg
                    }}
                    className={cn("p-3 pointer-events-auto bg-white text-slate-900 [&_button]:text-slate-900 [&_.rdp-day_selected]:!bg-primary [&_.rdp-day_selected]:!text-primary-foreground [&_button:hover]:bg-slate-100")}
                  />
                  <p className="px-3 pb-3 text-xs text-slate-500">Atendemos de terça a sábado</p>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Clock className="w-4 h-4 text-primary" /> Horário
              </label>
              <select value={time} onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none">
                <option value="">Selecione...</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">Das 9h às 20h</p>
            </div>
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
              {myAppointments.map((a: any) => {
                const canCancel = a.status !== "cancelado" && a.status !== "concluido"
                  && new Date(a.appointment_date).getTime() > Date.now();
                return (
                <div key={a.id} className="p-4 rounded-lg bg-card border border-border flex justify-between items-center gap-3">
                  <div className="flex-1">
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
                  {canCancel && (
                    <button
                      onClick={() => {
                        if (confirm("Deseja desmarcar este agendamento?")) cancelMutation.mutate(a.id);
                      }}
                      disabled={cancelMutation.isPending}
                      className="text-xs px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 font-medium"
                    >
                      Desmarcar
                    </button>
                  )}
                </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
