REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

DROP POLICY "Anyone can read published news" ON public.news;
CREATE POLICY "Public can read published news" ON public.news FOR SELECT TO anon USING (published = true);
CREATE POLICY "Signed in can read published news" ON public.news FOR SELECT TO authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'));

DROP POLICY "Anyone can read published spotlights" ON public.spotlights;
CREATE POLICY "Public can read published spotlights" ON public.spotlights FOR SELECT TO anon USING (published = true);
CREATE POLICY "Signed in can read published spotlights" ON public.spotlights FOR SELECT TO authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'));

DROP POLICY "Anyone can read published events" ON public.events;
CREATE POLICY "Public can read published events" ON public.events FOR SELECT TO anon USING (published = true);
CREATE POLICY "Signed in can read published events" ON public.events FOR SELECT TO authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'));