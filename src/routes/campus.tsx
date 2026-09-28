import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CLUB_NAME, imageUrl, newsQuery } from "@/lib/queries";
import { EmptyState, PageHeader, formatDate } from "@/components/site/PageHeader";

export const Route = createFileRoute("/campus")({
  head: () => ({
    meta: [
      { title: `Campus — ${CLUB_NAME}` },
      {
        name: "description",
        content: "Daily notes and announcements from The Literary Society around campus.",
      },
      { property: "og:title", content: `Campus — ${CLUB_NAME}` },
      { property: "og:description", content: "Daily notes and announcements from the club." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CampusPage,
});

function CampusPage() {
  const { data, isLoading } = useQuery(newsQuery);

  return (
    <>
      <PageHeader
        eyebrow="Campus"
        title="Notes from around college"
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
                  className="mt-6 w-full border border-border object-cover"
                />
              )}
              {n.body && (
                <p className="mt-5 whitespace-pre-line leading-relaxed">{n.body}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
