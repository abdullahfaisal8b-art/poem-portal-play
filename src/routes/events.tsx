import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, MapPin } from "lucide-react";
import { CLUB_NAME, eventsQuery, imageUrl, type Event } from "@/lib/queries";
import { EmptyState, PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: `Events — ${CLUB_NAME}` },
      {
        name: "description",
        content: "Readings, workshops and open mics hosted by the college poetry club.",
      },
      { property: "og:title", content: `Events — ${CLUB_NAME}` },
      { property: "og:description", content: "Readings, workshops and open mics." },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const { data, isLoading } = useQuery(eventsQuery);
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = data?.filter((e) => e.event_date >= today) ?? [];
  const past = (data?.filter((e) => e.event_date < today) ?? []).reverse();

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Readings & gatherings"
        intro="Open mics, workshops, guest poets and the occasional late-night verse exchange."
      />
      <div className="mx-auto max-w-6xl px-5">
        {isLoading && <p className="text-muted-foreground">Checking the calendar…</p>}
        {!isLoading && data?.length === 0 && (
          <EmptyState title="Nothing scheduled yet." hint="Upcoming events will be listed here." />
        )}
        {upcoming.length > 0 && (
          <section>
            <h2 className="eyebrow mb-6">Upcoming</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((e, i) => (
                <EventCard key={e.id} event={e} delay={i * 60} />
              ))}
            </div>
          </section>
        )}
        {past.length > 0 && (
          <section className="mt-16">
            <h2 className="eyebrow mb-6">Past events</h2>
            <div className="grid gap-6 opacity-70 md:grid-cols-2 lg:grid-cols-3">
              {past.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function EventCard({ event, delay = 0 }: { event: Event; delay?: number }) {
  const d = new Date(event.event_date + "T00:00:00");
  return (
    <article
      className="paper-card animate-fade-up flex gap-6 p-6"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex w-16 shrink-0 flex-col items-center border-r border-border pr-5">
        <span className="text-xs uppercase tracking-[0.2em] text-rust">
          {d.toLocaleDateString("en-US", { month: "short" })}
        </span>
        <span className="font-display text-5xl leading-none">{d.getDate()}</span>
        <span className="text-xs text-muted-foreground">{d.getFullYear()}</span>
      </div>
      <div className="min-w-0">
        {event.image_path && (
          <img
            src={imageUrl(event.image_path)}
            alt={event.title}
            loading="lazy"
            className="mb-4 aspect-video w-full border border-border object-cover"
          />
        )}
        <h3 className="text-2xl leading-tight">{event.title}</h3>
        <div className="mt-2 space-y-1 text-xs uppercase tracking-wider text-muted-foreground">
          {event.event_time && (
            <p className="flex items-center gap-1.5">
              <Clock className="size-3" /> {event.event_time}
            </p>
          )}
          {event.location && (
            <p className="flex items-center gap-1.5">
              <MapPin className="size-3" /> {event.location}
            </p>
          )}
        </div>
        {event.description && (
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{event.description}</p>
        )}
      </div>
    </article>
  );
}
