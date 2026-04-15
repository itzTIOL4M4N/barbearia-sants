
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  category TEXT NOT NULL DEFAULT 'corte',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are viewable by everyone"
  ON public.services FOR SELECT USING (true);

CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  service_id UUID NOT NULL REFERENCES public.services(id),
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create appointments"
  ON public.appointments FOR INSERT WITH CHECK (true);

CREATE POLICY "Appointments are viewable by everyone"
  ON public.appointments FOR SELECT USING (true);

INSERT INTO public.services (name, description, price, duration_minutes, category) VALUES
  ('Corte Clássico', 'Corte preciso com tesoura e máquina, acabamento perfeito.', 45.00, 30, 'corte'),
  ('Degradê', 'Degradê low, mid ou high fade com acabamento na navalha.', 50.00, 40, 'corte'),
  ('Corte Social', 'Corte elegante e discreto para o dia a dia.', 40.00, 30, 'corte'),
  ('Barba Completa', 'Modelagem e acabamento com navalha e toalha quente.', 35.00, 20, 'barba'),
  ('Barba Design', 'Desenho personalizado e alinhamento com navalha.', 40.00, 25, 'barba'),
  ('Combo Corte + Barba', 'Corte + barba completa + toalha quente.', 70.00, 50, 'combo'),
  ('Combo Premium', 'Corte + barba + hidratação + massagem.', 95.00, 60, 'combo');
