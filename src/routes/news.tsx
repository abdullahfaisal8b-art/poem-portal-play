import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CLUB_NAME, imageUrl, newsQuery } from "@/lib/queries";
import { EmptyState, PageHeader, formatDate } from "@/components/site/PageHeader";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: `Daily News — ${CLUB_NAME}` },
      {
        name: "description",
        content: "Daily notes and announcements from the college poetry club.",
      },
      { property: "og:title", content: `Daily News — ${CLUB_NAME}` },
      { property: "og:description", content: "Daily notes and announcements from the club." },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const { data, isLoading } = useQuery(newsQuery);

  return (
    <>
      <PageHeader
        eyebrow="Daily News"
        title="Notes from the club"
        intro="Announcements, prompts, small victories and everything happening between readings."
      />
      <div className="mx-auto max-w-3xl px-5">
        {isLoading && <p className="text-muted-foreground">Fetching today's notes…</p>}
        {!isLoading && data?.length === 0 && (
          <EmptyState title="Nothing posted yet." hint="Check back tomorrow." />
        )}
        <div className="divide-y divide-border">
          {data?.map((n, i) => (
            <article
              key={n.id}
              className="animate-fade-up py-10"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <p className="eyebrow">{formatDate(n.published_at)}</p>
              <h2 className="mt-3 text-4xl leading-tight">{n.title}</h2>
              {n.summary && <p className="mt-3 text-lg text-muted-foreground">{n.summary}</p>}
              {n.image_path && (
                <img
                  src={imageUrl(n.image_path)}
                  alt={n.title}
                  loading="lazy"
                  className="mt-6 w-full border border-border object-cover"
                />
              )}
              {n.body && (
                <div className="mt-6 whitespace-pre-line leading-relaxed">{n.body}</div>
              )}
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
