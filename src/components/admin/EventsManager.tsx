import { useState } from "react";
import type { Event } from "@/lib/queries";
import { useAdminTable } from "./useAdminTable";
import { formatDate } from "@/components/site/PageHeader";
import { Checkbox, Field, FormShell, ItemRow, ImageField, TextArea, TextInput } from "./fields";

const empty = {
  title: "",
  description: "",
  event_date: "",
  event_time: "",
  location: "",
  published: true,
  image_path: null as string | null,
};

export function EventsManager() {
  const { data, saveRow, deleteRow } = useAdminTable<Event>("events");
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<Event | null>(null);
  const [busy, setBusy] = useState(false);

  function startEdit(ev: Event) {
    setEditing(ev);
    setForm({
      title: ev.title,
      description: ev.description,
      event_date: ev.event_date,
      event_time: ev.event_time,
      location: ev.location,
      published: ev.published,
      image_path: ev.image_path,
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

  async function remove(ev: Event) {
    if (!confirm(`Delete "${ev.title}"?`)) return;
    await deleteRow(ev.id);
  }

  return (
    <div className="space-y-10">
      <FormShell title="event" onSubmit={submit} onCancel={reset} busy={busy} editing={!!editing}>
        <Field label="Event title">
          <TextInput
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </Field>
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Date">
            <TextInput
              type="date"
              required
              value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
            />
          </Field>
          <Field label="Time (e.g. 5:00 PM)">
            <TextInput
              value={form.event_time}
              onChange={(e) => setForm({ ...form, event_time: e.target.value })}
            />
          </Field>
          <Field label="Location">
            <TextInput
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Description">
          <TextArea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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
        <h3 className="eyebrow mb-2">All events ({data?.length ?? 0})</h3>
        <ul className="divide-y divide-border border-y border-border">
          {data?.length === 0 && (
            <li className="py-6 text-sm text-muted-foreground">Nothing scheduled yet.</li>
          )}
          {data?.map((ev) => (
            <ItemRow
              key={ev.id}
              title={ev.title}
              meta={`${formatDate(ev.event_date + "T00:00:00")}${ev.location ? ` · ${ev.location}` : ""}`}
              published={ev.published}
              onEdit={() => startEdit(ev)}
              onDelete={() => remove(ev)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
