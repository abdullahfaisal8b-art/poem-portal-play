import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { CLUB_NAME } from "@/lib/queries";
import { getPublishStatus, lockPublishing, unlockPublishing } from "@/lib/publish.functions";
import { PageHeader } from "@/components/site/PageHeader";
import { NewsManager } from "@/components/admin/NewsManager";
import { SpotlightManager } from "@/components/admin/SpotlightManager";
import { EventsManager } from "@/components/admin/EventsManager";

export const Route = createFileRoute("/publish")({
  head: () => ({
    meta: [
      { title: `Publish — ${CLUB_NAME}` },
      { name: "description", content: "Private publishing desk for the poetry club." },
      { property: "og:title", content: `Publish — ${CLUB_NAME}` },
      { property: "og:description", content: "Private publishing desk." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PublishPage,
});

type Tab = "news" | "spotlight" | "events";

function PublishPage() {
  const status = useQuery({ queryKey: ["publish-status"], queryFn: () => getPublishStatus() });

  if (status.isLoading) {
    return <p className="p-10 text-center text-muted-foreground">Checking your key…</p>;
  }
  return status.data?.unlocked ? <Desk /> : <UnlockForm />;
}

function UnlockForm() {
  const unlock = useServerFn(unlockPublishing);
  const qc = useQueryClient();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await unlock({ data: { password } });
      if (!res.ok) {
        toast.error("That's not the publishing password.");
        return;
      }
      qc.invalidateQueries({ queryKey: ["publish-status"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 pt-16">
      <p className="eyebrow">Publishing desk</p>
      <h1 className="mt-3 text-5xl">Enter the key</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        This desk is for the club's creator only. Visitors don't need anything to read the site.
      </p>
      <form onSubmit={submit} className="paper-card mt-10 space-y-6 p-8">
        <label className="block">
          <span className="eyebrow">Publishing password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-ink bg-transparent py-2 font-display text-xl outline-none focus:border-rust"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-foreground transition-colors hover:bg-rust disabled:opacity-50"
        >
          {busy ? "One moment…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}

function Desk() {
  const [tab, setTab] = useState<Tab>("news");
  const lock = useServerFn(lockPublishing);
  const qc = useQueryClient();
  const router = useRouter();

  async function doLock() {
    await lock();
    qc.clear();
    router.navigate({ to: "/" });
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
        <div className="mb-10 flex items-center justify-between border-b border-border">
          <div className="flex gap-8">
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
          <button
            onClick={doLock}
            className="pb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-rust"
          >
            Lock desk
          </button>
        </div>
        {tab === "news" && <NewsManager />}
        {tab === "spotlight" && <SpotlightManager />}
        {tab === "events" && <EventsManager />}
      </div>
    </>
  );
}
