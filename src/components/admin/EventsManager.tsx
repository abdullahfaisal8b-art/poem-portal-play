import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { eventsQuery, type Event } from "@/lib/queries";
import { formatDate } from "@/components/site/PageHeader";
import { Checkbox, Field, FormShell, ItemRow, TextArea, TextInput } from "./fields";

const empty = {
  title: "",
  description: "",
  event_date: "",
  event_time: "",
  location: "",
  published: true,
};

export function EventsManager() {
  const qc = useQueryClient();
  const { data } = useQuery(eventsQuery);
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
    const { error } = editing
      ? await supabase.from("events").update(form).eq("id", editing.id)
      : await supabase.from("events").insert(form);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Event updated" : "Event published");
    reset();
    qc.invalidateQueries({ queryKey: ["events"] });
  }

  async function remove(ev: Event) {
    if (!confirm(`Delete "${ev.title}"?`)) return;
    const { error } = await supabase.from("events").delete().eq("id", ev.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["events"] });
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
