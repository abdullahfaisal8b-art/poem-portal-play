import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, Newspaper, Sparkles } from "lucide-react";
import { CLUB_NAME, CLUB_TAGLINE, eventsQuery, newsQuery, spotlightsQuery } from "@/lib/queries";
import { formatDate } from "@/components/site/PageHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${CLUB_NAME} — ${CLUB_TAGLINE}` },
      {
        name: "description",
        content:
          "The college poetry club: writers spotlight, daily news, upcoming events and a word game for poets.",
      },
      { property: "og:title", content: `${CLUB_NAME} — ${CLUB_TAGLINE}` },
      {
        property: "og:description",
        content: "Writers spotlight, daily news, events and a word game for poets.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const spotlights = useQuery(spotlightsQuery);
  const news = useQuery(newsQuery);
  const events = useQuery(eventsQuery);

  const featured = spotlights.data?.[0];
  const latestNews = news.data?.slice(0, 3) ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.data?.filter((e) => e.event_date >= today).slice(0, 3) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-5">
      {/* Masthead */}
      <section className="animate-fade-up rule-top grid gap-10 py-14 md:grid-cols-12 md:py-24">
        <div className="md:col-span-8">
          <p className="eyebrow mb-4">{CLUB_TAGLINE}</p>
          <h1 className="text-6xl leading-[0.95] md:text-8xl">
            Where the quiet <em className="text-rust">lines</em> get read aloud.
          </h1>
          <p className="mt-8 max-w-lg text-lg text-muted-foreground">
            A home for the college's poets: weekly spotlights on our writers, the club's daily
            notes, readings and workshops, and a small game to sharpen your vocabulary.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/spotlight"
              className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-foreground transition-colors hover:bg-rust"
            >
              Read the spotlight <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/game"
              className="inline-flex items-center gap-2 border border-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-ink-foreground"
            >
              Play the word game
            </Link>
          </div>
        </div>
        <div className="hidden md:col-span-4 md:block">
          <div className="paper-card h-full p-8">
            <p className="eyebrow">This week</p>
            {featured ? (
              <>
                <p className="mt-4 font-display text-3xl">{featured.writer_name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{featured.headline}</p>
                <p className="poem-text mt-6 line-clamp-6 text-base">{featured.poem}</p>
              </>
            ) : (
              <p className="mt-4 font-display text-2xl italic text-muted-foreground">
                The first writer spotlight will appear here.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Three columns */}
      <section className="rule-top grid gap-12 py-14 md:grid-cols-3">
        <Column
          icon={<Sparkles className="size-4" />}
          title="Writers Spotlight"
          to="/spotlight"
          empty="No writers featured yet."
          items={(spotlights.data ?? []).slice(0, 3).map((s) => ({
            id: s.id,
            title: s.writer_name,
            meta: s.headline || formatDate(s.featured_at),
          }))}
        />
        <Column
          icon={<Newspaper className="size-4" />}
          title="Daily News"
          to="/news"
          empty="No news posted yet."
          items={latestNews.map((n) => ({
            id: n.id,
            title: n.title,
            meta: formatDate(n.published_at),
          }))}
        />
        <Column
          icon={<CalendarDays className="size-4" />}
          title="Upcoming Events"
          to="/events"
          empty="Nothing scheduled yet."
          items={upcoming.map((e) => ({
            id: e.id,
            title: e.title,
            meta: `${formatDate(e.event_date)}${e.location ? ` · ${e.location}` : ""}`,
          }))}
        />
      </section>
    </div>
  );
}

function Column({
  icon,
  title,
  to,
  items,
  empty,
}: {
  icon: React.ReactNode;
  title: string;
  to: "/spotlight" | "/news" | "/events";
  items: { id: string; title: string; meta: string }[];
  empty: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-rust">
        {icon}
        <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-rust">
          {title}
        </h2>
      </div>
      <ul className="mt-6 divide-y divide-border border-y border-border">
        {items.length === 0 && (
          <li className="py-5 font-display text-xl italic text-muted-foreground">{empty}</li>
        )}
        {items.map((it) => (
          <li key={it.id} className="py-5">
            <p className="font-display text-2xl leading-tight">{it.title}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{it.meta}</p>
          </li>
        ))}
      </ul>
      <Link
        to={to}
        className="mt-5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] hover:text-rust"
      >
        View all <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}
