CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
ON public.products
FOR SELECT
USING (true);

CREATE POLICY "Barbers can manage products"
ON public.products
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'barbeiro'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'barbeiro'::public.app_role));

INSERT INTO public.products (name, description, price)
VALUES ('Balm', 'Balm hidratante para barba, nutre e modela os fios com fragrância masculina.', 30.00);