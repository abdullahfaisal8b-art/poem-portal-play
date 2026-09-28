import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Check, Trash2, X } from "lucide-react";
import { CLUB_NAME } from "@/lib/queries";
import {
  adminDeleteSubmission,
  adminListSubmissions,
  adminPublishSubmission,
  adminSetSubmissionStatus,
} from "@/lib/publish.functions";
import { formatDate } from "@/components/site/PageHeader";

const FILTERS = [
  { id: "new", label: "Waiting" },
  { id: "approved", label: "Approved" },
  { id: "declined", label: "Declined" },
] as const;

type Status = (typeof FILTERS)[number]["id"];

export function SubmissionsManager() {
  const [status, setStatus] = useState<Status>("new");
  const list = useServerFn(adminListSubmissions);
  const setStatusFn = useServerFn(adminSetSubmissionStatus);
  const remove = useServerFn(adminDeleteSubmission);
  const publish = useServerFn(adminPublishSubmission);
  const [busy, setBusy] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["admin", "submissions", status],
    queryFn: () => list({ data: { status } }),
  });

  async function run(id: string, action: () => Promise<unknown>, message: string) {
    setBusy(id);
    try {
      await action();
      toast.success(message);
      query.refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not do that just now.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setStatus(f.id)}
            className={`border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
              status === f.id ? "border-ink bg-ink text-ink-foreground" : "border-border hover:border-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {query.isLoading && <p className="text-sm text-muted-foreground">Opening the post…</p>}
      {!query.isLoading && query.data?.length === 0 && (
        <p className="py-6 text-sm text-muted-foreground">
          Nothing {FILTERS.find((f) => f.id === status)?.label.toLowerCase()} right now.
        </p>
      )}

      <ul className="divide-y divide-border border-y border-border">
        {query.data?.map((s) => (
          <li key={s.id} className="py-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-display text-2xl">
                {s.title || "Untitled"}{" "}
                <span className="ml-2 font-sans text-sm text-muted-foreground">
                  by {s.writer_name}
                </span>
              </p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {s.work_type} · {formatDate(s.created_at)}
              </p>
            </div>
            {s.note && <p className="mt-2 text-sm italic text-muted-foreground">{s.note}</p>}

            <button
              onClick={() => setOpen(open === s.id ? null : s.id)}
              className="mt-3 text-xs uppercase tracking-[0.18em] text-rust hover:underline"
            >
              {open === s.id ? "Hide the work" : "Read the work"}
            </button>
            {open === s.id && (
              <p className="mt-4 whitespace-pre-line border border-border bg-card p-5 font-display text-lg leading-relaxed">
                {s.body}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              {status !== "approved" && (
                <button
                  disabled={busy === s.id}
                  onClick={() =>
                    run(s.id, () => publish({ data: { id: s.id } }), "Published in Spotlights")
                  }
                  className="bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink-foreground transition-colors hover:bg-rust disabled:opacity-50"
                >
                  Publish in Spotlights
                </button>
              )}
              <button
                disabled={busy === s.id}
                onClick={() =>
                  run(
                    s.id,
                    () => setStatusFn({ data: { id: s.id, status: "approved" } }),
                    "Marked approved",
                  )
                }
                className="flex items-center gap-2 border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] hover:border-moss disabled:opacity-50"
              >
                <Check className="size-3.5" /> Approve
              </button>
              <button
                disabled={busy === s.id}
                onClick={() =>
                  run(
                    s.id,
                    () => setStatusFn({ data: { id: s.id, status: "declined" } }),
                    "Marked declined",
                  )
                }
                className="flex items-center gap-2 border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] hover:border-destructive disabled:opacity-50"
              >
                <X className="size-3.5" /> Decline
              </button>
              <button
                disabled={busy === s.id}
                onClick={() => {
                  if (!confirm(`Delete this submission from ${s.writer_name}?`)) return;
                  run(s.id, () => remove({ data: { id: s.id } }), "Deleted");
                }}
                className="flex items-center gap-2 border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-destructive hover:border-destructive disabled:opacity-50"
              >
                <Trash2 className="size-3.5" /> Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <p className="text-xs text-muted-foreground">
        Submissions from the {CLUB_NAME} Creative page land here first.
      </p>
    </div>
  );
}
