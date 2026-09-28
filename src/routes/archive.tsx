import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Archive as ArchiveIcon } from "lucide-react";
import { CLUB_NAME, cornerQuery, eventsQuery, newsQuery, spotlightsQuery } from "@/lib/queries";
import { EmptyState, PageHeader, formatDate } from "@/components/site/PageHeader";

export const Route = createFileRoute("/archive")({
  head: () => ({
    meta: [
      { title: `Archive — ${CLUB_NAME}` },
      {
        name: "description",
        content:
          "Everything The Literary Society has published: campus notes, writer spotlights, events and literary corner features.",
      },
      { property: "og:title", content: `Archive — ${CLUB_NAME}` },
      {
        property: "og:description",
        content: "Everything the club has published, collected in one list.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArchivePage,
});

type Section = "all" | "campus" | "spotlights" | "events" | "corner";

type Item = {
  id: string;
  section: Exclude<Section, "all">;
  label: string;
  title: string;
  meta: string;
  date: string;
  to: string;
};

const FILTERS: { id: Section; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "campus", label: "Campus" },
  { id: "spotlights", label: "Spotlights" },
  { id: "events", label: "Events" },
  { id: "corner", label: "Literary Corner" },
];

function ArchivePage() {
  const news = useQuery(newsQuery);
  const spotlights = useQuery(spotlightsQuery);
  const events = useQuery(eventsQuery);
  const corner = useQuery(cornerQuery);
  const [section, setSection] = useState<Section>("all");

  const items = useMemo<Item[]>(() => {
    const list: Item[] = [
      ...(news.data ?? []).map((n) => ({
        id: `news-${n.id}`,
        section: "campus" as const,
        label: "Campus",
        title: n.title,
        meta: n.summary || "Campus note",
        date: n.published_at,
        to: "/campus",
      })),
      ...(spotlights.data ?? []).map((s) => ({
        id: `spot-${s.id}`,
        section: "spotlights" as const,
        label: "Spotlight",
        title: s.writer_name,
        meta: s.headline || s.poem_title || "Writer spotlight",
        date: s.featured_at,
        to: "/spotlight",
      })),
      ...(events.data ?? []).map((e) => ({
        id: `event-${e.id}`,
        section: "events" as const,
        label: "Event",
        title: e.title,
        meta: e.location ? `${e.location}${e.event_time ? ` · ${e.event_time}` : ""}` : "Event",
        date: `${e.event_date}T12:00:00`,
        to: "/events",
      })),
      ...(corner.data ?? []).map((c) => ({
        id: `corner-${c.id}`,
        section: "corner" as const,
        label: c.kind === "book" ? "Book of the month" : "Literary note",
        title: c.title,
        meta: c.month || "Literary corner",
        date: c.created_at,
        to: "/creative",
      })),
    ];
    return list.sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [news.data, spotlights.data, events.data, corner.data]);

  const shown = items.filter((i) => section === "all" || i.section === section);
  const loading = news.isLoading || spotlights.isLoading || events.isLoading || corner.isLoading;

  return (
    <>
      <PageHeader
        eyebrow="Archive"
        title="The full shelf"
        intro="Everything the society has published, newest first. Filter by section if you're after something specific."
      />
      <div className="mx-auto max-w-4xl px-5">
        <div className="mb-10 flex flex-wrap gap-3">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSection(f.id)}
              className={`border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
                section === f.id
                  ? "border-ink bg-ink text-ink-foreground"
                  : "border-border hover:border-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && <p className="text-muted-foreground">Opening the shelves…</p>}
        {!loading && shown.length === 0 && (
          <EmptyState
            title="Nothing filed here yet."
            hint="Published work lands in the archive automatically."
          />
        )}

        <ul className="divide-y divide-border border-y border-border">
          {shown.map((item) => (
            <li key={item.id} className="py-6">
              <Link to={item.to} className="group flex flex-col gap-1">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="eyebrow">{item.label}</p>
                  <p className="shrink-0 text-xs uppercase tracking-wider text-muted-foreground">
                    {formatDate(item.date)}
                  </p>
                </div>
                <h2 className="mt-1 font-display text-3xl leading-tight transition-colors group-hover:text-rust">
                  {item.title}
                </h2>
                <p className="text-sm text-muted-foreground">{item.meta}</p>
              </Link>
            </li>
          ))}
        </ul>

        {shown.length > 0 && (
          <p className="mt-10 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <ArchiveIcon className="size-4" /> {shown.length} {shown.length === 1 ? "entry" : "entries"}
          </p>
        )}
      </div>
    </>
  );
}
