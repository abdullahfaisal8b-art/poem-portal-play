ALTER TABLE public.news ADD COLUMN IF NOT EXISTS image_path text;
ALTER TABLE public.spotlights ADD COLUMN IF NOT EXISTS image_path text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_path text;