import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarIcon, Clock, User, Phone } from "lucide-react";

interface BookingFormProps {
  selectedServiceId?: string;
  formRef: React.RefObject<HTMLDivElement | null>;
}

const BookingForm = ({ selectedServiceId, formRef }: BookingFormProps) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState(selectedServiceId || "");
  const [date, setDate] = useState("");

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("price");
      if (error) throw error;
      return data;
    },
  });

  // Sync selected service from parent
  if (selectedServiceId && selectedServiceId !== serviceId) {
    setServiceId(selectedServiceId);
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("appointments").insert({
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        service_id: serviceId,
        appointment_date: new Date(date).toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Agendamento confirmado! 🎉", {
        description: "Aguardamos você no horário marcado.",
      });
      setName("");
      setPhone("");
      setServiceId("");
      setDate("");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: () => {
      toast.error("Erro ao agendar", {
        description: "Tente novamente mais tarde.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !serviceId || !date) {
      toast.error("Preencha todos os campos");
      return;
    }
    mutation.mutate();
  };

  const selectedService = services?.find((s) => s.id === serviceId);

  return (
    <section ref={formRef} id="agendar" className="py-16 md:py-24 px-6 border-t border-border">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-heading font-semibold text-primary text-center mb-4">
          Agende Seu Horário
        </h2>
        <p className="text-muted-foreground text-center mb-12">
          Escolha o serviço, data e horário de sua preferência.
        </p>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 rounded-xl bg-card border border-border space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <User className="w-4 h-4 text-primary" />
              Seu nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João Silva"
              maxLength={100}
              className="w-full px-5 py-3.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Phone className="w-4 h-4 text-primary" />
              Telefone / WhatsApp
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              maxLength={20}
              className="w-full px-5 py-3.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Clock className="w-4 h-4 text-primary" />
              Serviço
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-5 py-3.5 rounded-lg bg-background border border-border text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            >
              <option value="">Selecione um serviço</option>
              {services?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — R${s.price}
                </option>
              ))}
            </select>
          </div>

          {selectedService && (
            <div className="px-4 py-3 rounded-lg bg-secondary/50 border border-primary/20 text-sm">
              <span className="text-primary font-semibold">{selectedService.name}</span>
              {" · "}
              <span className="text-muted-foreground">{selectedService.duration_minutes} min</span>
              {" · "}
              <span className="text-primary font-bold">R${selectedService.price}</span>
            </div>
          )}

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <CalendarIcon className="w-4 h-4 text-primary" />
              Data e Horário
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-5 py-3.5 rounded-lg bg-background border border-border text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-4 gold-gradient text-primary-foreground font-semibold rounded-lg text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {mutation.isPending ? "Agendando..." : "Confirmar Agendamento"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default BookingForm;
