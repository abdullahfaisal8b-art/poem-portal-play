CREATE TABLE public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  writer_name text NOT NULL,
  title text NOT NULL DEFAULT '',
  work_type text NOT NULL DEFAULT 'poem',
  body text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT submissions_status_check CHECK (status IN ('new', 'approved', 'declined')),
  CONSTRAINT submissions_work_type_check CHECK (work_type IN ('poem', 'short story', 'essay', 'artwork'))
);

GRANT INSERT ON public.submissions TO anon;
GRANT INSERT ON public.submissions TO authenticated;
GRANT ALL ON public.submissions TO service_role;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send in their work" ON public.submissions FOR INSERT TO anon, authenticated WITH CHECK (status = 'new');