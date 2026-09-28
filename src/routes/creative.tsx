import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { BookOpen, Feather, Info } from "lucide-react";
import { CLUB_NAME, cornerQuery } from "@/lib/queries";
import { submitWork } from "@/lib/publish.functions";
import { PageHeader } from "@/components/site/PageHeader";
import { Field, TextArea, TextInput } from "@/components/admin/fields";

export const Route = createFileRoute("/creative")({
  head: () => ({
    meta: [
      { title: `Creative — ${CLUB_NAME}` },
      {
        name: "description",
        content:
          "The Literary Corner: book of the month and a literary note, plus how to send your own poems, stories and essays to the club.",
      },
      { property: "og:title", content: `Creative — ${CLUB_NAME}` },
      {
        property: "og:description",
        content: "Book of the month, a literary note, and how to send in your writing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreativePage,
});

function CreativePage() {
  const corner = useQuery(cornerQuery);
  const book = corner.data?.find((c) => c.kind === "book");
  const note = corner.data?.find((c) => c.kind === "note");

  return (
    <>
      <PageHeader
        eyebrow="Creative"
        title="Write, read, send it in"
        intro="The Literary Corner changes with the month, and the submissions desk is always open."
      />

      <section className="mx-auto max-w-5xl px-5">
        <div className="rule-double mb-8 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-3xl md:text-4xl">The Literary Corner</h2>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {book?.month || note?.month || "This month"}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="paper-card flex flex-col p-8">
            <p className="eyebrow flex items-center gap-2">
              <BookOpen className="size-3.5" /> Book of the month
            </p>
            {book ? (
              <>
                <h3 className="mt-5 font-display text-3xl leading-tight">{book.title}</h3>
                <p className="mt-4 whitespace-pre-line leading-relaxed text-foreground/90">
                  {book.body}
                </p>
              </>
            ) : (
              <p className="mt-5 text-muted-foreground">
                Nothing shelved yet — the next pick appears here at the start of the month.
              </p>
            )}
          </article>

          <article className="paper-card flex flex-col p-8">
            <p className="eyebrow flex items-center gap-2">
              <Feather className="size-3.5" /> Literary note
            </p>
            {note ? (
              <>
                <h3 className="mt-5 font-display text-3xl leading-tight">{note.title}</h3>
                <p className="mt-4 whitespace-pre-line leading-relaxed text-foreground/90">
                  {note.body}
                </p>
              </>
            ) : (
              <p className="mt-5 text-muted-foreground">
                A short literary fact or author feature will sit here this month.
              </p>
            )}
          </article>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-3xl px-5">
        <div className="rule-double mb-8">
          <h2 className="font-display text-3xl md:text-4xl">Send us your work</h2>
        </div>
        <div className="paper-card p-8">
          <p className="flex items-start gap-3 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" />
            Everything is read by the club's creator. Accepted pieces are published under
            Spotlights, and nothing you send appears on the site until then.
          </p>
          <ol className="mt-6 space-y-3 text-sm">
            <li>
              <span className="eyebrow mr-2">Step 1</span> Write a poem, short story, essay or
              artwork note — one piece at a time.
            </li>
            <li>
              <span className="eyebrow mr-2">Step 2</span> Fill the form below and send it in.
            </li>
            <li>
              <span className="eyebrow mr-2">Step 3</span> If it's chosen, it goes up in the
              Spotlights with your name on it.
            </li>
          </ol>
        </div>

        <SubmissionForm />
      </section>
    </>
  );
}

function SubmissionForm() {
  const send = useServerFn(submitWork);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const value = (name: string) =>
      new FormData(form).get(name)?.toString().trim() ?? "";
    setBusy(true);
    try {
      await send({
        data: {
          writer_name: value("writer_name"),
          title: value("title"),
          work_type: value("work_type") as
            | "poem"
            | "short story"
            | "essay"
            | "artwork",
          body: value("body"),
          note: value("note"),
          website: value("website"),
        },
      });
      form.reset();
      setDone(true);
      toast.success("Sent in — thank you.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send that just now.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="paper-card mt-6 space-y-5 p-8">
      <h3 className="text-2xl">Submissions desk</h3>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name">
          <TextInput name="writer_name" required placeholder="Who wrote this?" />
        </Field>
        <Field label="Type of work">
          <select
            name="work_type"
            defaultValue="poem"
            className="w-full border border-input bg-card px-3 py-2 text-sm outline-none focus:border-rust focus:ring-1 focus:ring-rust"
          >
            <option value="poem">Poem</option>
            <option value="short story">Short story</option>
            <option value="essay">Essay</option>
            <option value="artwork">Artwork</option>
          </select>
        </Field>
      </div>

      <Field label="Title">
        <TextInput name="title" placeholder="Give it a name" />
      </Field>

      <Field label="The work">
        <TextArea
          name="body"
          required
          placeholder="Paste your piece here…"
          className="min-h-48 font-display text-lg"
        />
      </Field>

      <Field label="A note for the desk (optional)">
        <TextInput name="note" placeholder="Anything we should know about it?" />
      </Field>

      <input
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <button
        type="submit"
        disabled={busy}
        className="bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-foreground transition-colors hover:bg-rust disabled:opacity-50"
      >
        {busy ? "Sending…" : done ? "Send another" : "Send it in"}
      </button>

      {done && (
        <p className="text-sm text-muted-foreground">
          It's with the desk. You'll see it in Spotlights if it's chosen.
        </p>
      )}
    </form>
  );
}
