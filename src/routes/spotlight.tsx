import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CLUB_NAME, spotlightsQuery } from "@/lib/queries";
import { EmptyState, PageHeader, formatDate } from "@/components/site/PageHeader";

export const Route = createFileRoute("/spotlight")({
  head: () => ({
    meta: [
      { title: `Writers Spotlight — ${CLUB_NAME}` },
      {
        name: "description",
        content: "Featured poets from the college poetry club, with a poem from each writer.",
      },
      { property: "og:title", content: `Writers Spotlight — ${CLUB_NAME}` },
      { property: "og:description", content: "Featured poets and their work." },
    ],
  }),
  component: SpotlightPage,
});

function SpotlightPage() {
  const { data, isLoading } = useQuery(spotlightsQuery);

  return (
    <>
      <PageHeader
        eyebrow="Writers Spotlight"
        title="The poets among us"
        intro="Every feature is chosen by the club and published here — one writer, one poem, in their own words."
      />
      <div className="mx-auto max-w-6xl space-y-16 px-5">
        {isLoading && <p className="text-muted-foreground">Turning the page…</p>}
        {!isLoading && data?.length === 0 && (
          <EmptyState
            title="No writers featured yet."
            hint="The club's first spotlight will be published soon."
          />
        )}
        {data?.map((s, i) => (
          <article
            key={s.id}
            className="animate-fade-up grid gap-8 border-t border-border pt-10 md:grid-cols-12"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="md:col-span-4">
              <p className="eyebrow">{formatDate(s.featured_at)}</p>
              <h2 className="mt-3 text-4xl leading-tight">{s.writer_name}</h2>
              {s.headline && <p className="mt-2 text-lg text-rust italic">{s.headline}</p>}
              {s.bio && (
                <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {s.bio}
                </p>
              )}
            </div>
            <div className="paper-card md:col-span-8 p-8 md:p-12">
              {s.poem_title && <h3 className="text-3xl">{s.poem_title}</h3>}
              <p className="poem-text mt-6">{s.poem}</p>
              <p className="mt-8 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                — {s.writer_name}
              </p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
