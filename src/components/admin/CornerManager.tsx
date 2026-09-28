import { useState } from "react";
import type { Corner } from "@/lib/queries";
import { useAdminTable } from "./useAdminTable";
import { Checkbox, Field, FormShell, ItemRow, TextArea, TextInput } from "./fields";

const empty = {
  kind: "book" as "book" | "note",
  title: "",
  body: "",
  month: new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
  published: true,
};

export function CornerManager() {
  const { data, saveRow, deleteRow } = useAdminTable<Corner>("corner");
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<Corner | null>(null);
  const [busy, setBusy] = useState(false);

  function startEdit(c: Corner) {
    setEditing(c);
    setForm({
      kind: c.kind === "note" ? "note" : "book",
      title: c.title,
      body: c.body,
      month: c.month,
      published: c.published,
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

  async function remove(c: Corner) {
    if (!confirm(`Delete "${c.title}"?`)) return;
    await deleteRow(c.id);
  }

  return (
    <div className="space-y-10">
      <FormShell
        title="literary corner feature"
        onSubmit={submit}
        onCancel={reset}
        busy={busy}
        editing={!!editing}
      >
        <Field label="Feature">
          <select
            value={form.kind}
            onChange={(e) => setForm({ ...form, kind: e.target.value as "book" | "note" })}
            className="w-full border border-input bg-card px-3 py-2 text-sm outline-none focus:border-rust focus:ring-1 focus:ring-rust"
          >
            <option value="book">Book of the month</option>
            <option value="note">Literary note</option>
          </select>
        </Field>
        <Field label="Title">
          <TextInput
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder={form.kind === "book" ? "Book title" : "The note's heading"}
          />
        </Field>
        <Field label="Month">
          <TextInput
            value={form.month}
            onChange={(e) => setForm({ ...form, month: e.target.value })}
            placeholder="September 2026"
          />
        </Field>
        <Field label={form.kind === "book" ? "Your recommendation or review" : "The note"}>
          <TextArea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            className="min-h-40"
          />
        </Field>
        <Checkbox
          label="Published (visible to everyone)"
          checked={form.published}
          onChange={(v) => setForm({ ...form, published: v })}
        />
      </FormShell>

      <div>
        <h3 className="eyebrow mb-2">All features ({data?.length ?? 0})</h3>
        <ul className="divide-y divide-border border-y border-border">
          {data?.length === 0 && (
            <li className="py-6 text-sm text-muted-foreground">
              Nothing in the corner yet — add this month's pick.
            </li>
          )}
          {data?.map((c) => (
            <ItemRow
              key={c.id}
              title={c.title}
              meta={`${c.kind === "book" ? "Book of the month" : "Literary note"}${c.month ? ` · ${c.month}` : ""}`}
              published={c.published}
              onEdit={() => startEdit(c)}
              onDelete={() => remove(c)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
