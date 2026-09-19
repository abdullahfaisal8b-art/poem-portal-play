export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="rule-top animate-fade-up mx-auto max-w-6xl px-5 pt-10 pb-12">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h1 className="text-5xl leading-[1.05] md:text-7xl">{title}</h1>
      {intro && <p className="mt-5 max-w-xl text-lg text-muted-foreground">{intro}</p>}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="paper-card mx-auto max-w-xl px-8 py-14 text-center">
      <p className="font-display text-3xl italic">{title}</p>
      <p className="mt-3 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
