import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CLUB_NAME } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import { NewsManager } from "@/components/admin/NewsManager";
import { SpotlightManager } from "@/components/admin/SpotlightManager";
import { EventsManager } from "@/components/admin/EventsManager";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: `Publish — ${CLUB_NAME}` },
      { name: "description", content: "Manage news, spotlights and events." },
      { property: "og:title", content: `Publish — ${CLUB_NAME}` },
      { property: "og:description", content: "Manage the poetry club website." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Tab = "news" | "spotlight" | "events";

function AdminPage() {
  const { user, isAdmin, loading, refreshAdmin } = useAuth();
  const [tab, setTab] = useState<Tab>("news");
  const [claiming, setClaiming] = useState(false);

  // Automatically try to claim the admin seat — only works for the first account ever.
  useEffect(() => {
    if (loading || !user || isAdmin) return;
    setClaiming(true);
    supabase
      .rpc("claim_admin")
      .then(async ({ data, error }) => {
        if (error) toast.error(error.message);
        if (data) await refreshAdmin();
      })
      .then(() => setClaiming(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, isAdmin]);

  if (loading || claiming) {
    return <p className="p-10 text-center text-muted-foreground">Checking your key…</p>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-5 pt-16 text-center">
        <p className="eyebrow">Members</p>
        <h1 className="mt-3 text-4xl">This desk is reserved.</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Only the club's creator can publish here. You're signed in as {user?.email}, which
          doesn't have publishing rights.
        </p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "news", label: "Daily News" },
    { id: "spotlight", label: "Writers Spotlight" },
    { id: "events", label: "Events" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Publishing desk"
        title="Manage the club"
        intro="Everything you publish here appears on the site immediately. Untick 'Published' to keep a draft private."
      />
      <div className="mx-auto max-w-4xl px-5">
        <div className="mb-10 flex gap-8 border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px border-b-2 pb-3 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
                tab === t.id
                  ? "border-rust text-ink"
                  : "border-transparent text-muted-foreground hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === "news" && <NewsManager />}
        {tab === "spotlight" && <SpotlightManager />}
        {tab === "events" && <EventsManager />}
      </div>
    </>
  );
}
