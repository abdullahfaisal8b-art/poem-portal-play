import { useState } from "react";
import type { News } from "@/lib/queries";
import { useAdminTable } from "./useAdminTable";
import { formatDate } from "@/components/site/PageHeader";
import { Checkbox, Field, FormShell, ItemRow, ImageField, TextArea, TextInput } from "./fields";

const empty = { title: "", summary: "", body: "", published: true, image_path: null as string | null };

export function NewsManager() {
  const { data, saveRow, deleteRow } = useAdminTable<News>("news");
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<News | null>(null);
  const [busy, setBusy] = useState(false);

  function startEdit(n: News) {
    setEditing(n);
    setForm({
      title: n.title,
      summary: n.summary,
      body: n.body,
      published: n.published,
      image_path: n.image_path,
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

  async function remove(n: News) {
    if (!confirm(`Delete "${n.title}"?`)) return;
    await deleteRow(n.id);
  }

  return (
    <div className="space-y-10">
      <FormShell title="news post" onSubmit={submit} onCancel={reset} busy={busy} editing={!!editing}>
        <Field label="Title">
          <TextInput
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </Field>
        <Field label="Summary (one line)">
          <TextInput
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
        </Field>
        <Field label="Full text">
          <TextArea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        </Field>
        <ImageField value={form.image_path} onChange={(v) => setForm({ ...form, image_path: v })} />
        <Checkbox
          label="Published (visible to everyone)"
          checked={form.published}
          onChange={(v) => setForm({ ...form, published: v })}
        />
      </FormShell>

      <div>
        <h3 className="eyebrow mb-2">All news ({data?.length ?? 0})</h3>
        <ul className="divide-y divide-border border-y border-border">
          {data?.length === 0 && (
            <li className="py-6 text-sm text-muted-foreground">Nothing posted yet.</li>
          )}
          {data?.map((n) => (
            <ItemRow
              key={n.id}
              title={n.title}
              meta={formatDate(n.published_at)}
              published={n.published}
              onEdit={() => startEdit(n)}
              onDelete={() => remove(n)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
