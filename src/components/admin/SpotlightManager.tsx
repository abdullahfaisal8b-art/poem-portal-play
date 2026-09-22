import { useState } from "react";
import type { Spotlight } from "@/lib/queries";
import { useAdminTable } from "./useAdminTable";
import { formatDate } from "@/components/site/PageHeader";
import { Checkbox, Field, FormShell, ItemRow, ImageField, TextArea, TextInput } from "./fields";

const empty = {
  writer_name: "",
  headline: "",
  bio: "",
  poem_title: "",
  poem: "",
  published: true,
  image_path: null as string | null,
};

export function SpotlightManager() {
  const { data, saveRow, deleteRow } = useAdminTable<Spotlight>("spotlights");
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<Spotlight | null>(null);
  const [busy, setBusy] = useState(false);

  function startEdit(s: Spotlight) {
    setEditing(s);
    setForm({
      writer_name: s.writer_name,
      headline: s.headline,
      bio: s.bio,
      poem_title: s.poem_title,
      poem: s.poem,
      published: s.published,
      image_path: s.image_path,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setEditing(null);
    setForm(empty);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const ok = await saveRow(form, editing?.id);
    setBusy(false);
    if (ok) reset();
  }

  async function remove(s: Spotlight) {
    if (!confirm(`Delete the spotlight on ${s.writer_name}?`)) return;
    await deleteRow(s.id);
  }

  return (
    <div className="space-y-10">
      <FormShell title="spotlight" onSubmit={submit} onCancel={reset} busy={busy} editing={!!editing}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Writer's name">
            <TextInput
              required
              value={form.writer_name}
              onChange={(e) => setForm({ ...form, writer_name: e.target.value })}
            />
          </Field>
          <Field label="Headline (e.g. 'Second year, writes at midnight')">
            <TextInput
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
            />
          </Field>
        </div>
        <Field label="About the writer">
          <TextArea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </Field>
        <Field label="Poem title">
          <TextInput
            value={form.poem_title}
            onChange={(e) => setForm({ ...form, poem_title: e.target.value })}
          />
        </Field>
        <Field label="Poem (line breaks are kept)">
          <TextArea
            required
            value={form.poem}
            onChange={(e) => setForm({ ...form, poem: e.target.value })}
            style={{ minHeight: 200 }}
          />
        </Field>
        <ImageField value={form.image_path} onChange={(v) => setForm({ ...form, image_path: v })} />
        <Checkbox
          label="Published (visible to everyone)"
          checked={form.published}
          onChange={(v) => setForm({ ...form, published: v })}
        />
      </FormShell>

      <div>
        <h3 className="eyebrow mb-2">All spotlights ({data?.length ?? 0})</h3>
        <ul className="divide-y divide-border border-y border-border">
          {data?.length === 0 && (
            <li className="py-6 text-sm text-muted-foreground">No writers featured yet.</li>
          )}
          {data?.map((s) => (
            <ItemRow
              key={s.id}
              title={s.writer_name}
              meta={`${s.poem_title || "Untitled"} · ${formatDate(s.featured_at)}`}
              published={s.published}
              onEdit={() => startEdit(s)}
              onDelete={() => remove(s)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
