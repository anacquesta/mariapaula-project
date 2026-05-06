
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  area TEXT NOT NULL,
  message TEXT,
  slot_at TIMESTAMPTZ NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Anyone can create an appointment (public booking)
CREATE POLICY "Anyone can book"
  ON public.appointments FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    slot_at > now()
    AND length(name) BETWEEN 2 AND 100
    AND length(email) BETWEEN 5 AND 255
    AND length(whatsapp) BETWEEN 8 AND 25
    AND length(area) BETWEEN 1 AND 80
  );

-- No public SELECT (protect PII). Use function below for taken slots.
CREATE POLICY "No public read"
  ON public.appointments FOR SELECT
  TO anon, authenticated
  USING (false);

-- Public function: returns only timestamps of taken slots in a date range
CREATE OR REPLACE FUNCTION public.get_taken_slots(from_date TIMESTAMPTZ, to_date TIMESTAMPTZ)
RETURNS TABLE(slot_at TIMESTAMPTZ)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT slot_at FROM public.appointments
  WHERE slot_at >= from_date AND slot_at < to_date AND status = 'confirmed';
$$;

GRANT EXECUTE ON FUNCTION public.get_taken_slots(TIMESTAMPTZ, TIMESTAMPTZ) TO anon, authenticated;
