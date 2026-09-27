CREATE TABLE public.corner (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'note',
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  month text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT corner_kind_check CHECK (kind IN ('book', 'note'))
);

GRANT SELECT ON public.corner TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.corner TO authenticated;
GRANT ALL ON public.corner TO service_role;
ALTER TABLE public.corner ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published corner features" ON public.corner FOR SELECT TO anon USING (published = true);
CREATE POLICY "Public can read published corner features (signed in)" ON public.corner FOR SELECT TO authenticated USING (published = true);