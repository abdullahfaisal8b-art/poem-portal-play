import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { spotlightsQuery, type Spotlight } from "@/lib/queries";
import { formatDate } from "@/components/site/PageHeader";
import { Checkbox, Field, FormShell, ItemRow, TextArea, TextInput } from "./fields";

const empty = {
  writer_name: "",
  headline: "",
  bio: "",
  poem_title: "",
  poem: "",
  published: true,
};

export function SpotlightManager() {
  const qc = useQueryClient();
  const { data } = useQuery(spotlightsQuery);
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
      ? await supabase.from("spotlights").update(form).eq("id", editing.id)
      : await supabase.from("spotlights").insert(form);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editing ? "Spotlight updated" : "Spotlight published");
    reset();
    qc.invalidateQueries({ queryKey: ["spotlights"] });
  }

  async function remove(s: Spotlight) {
    if (!confirm(`Delete the spotlight on ${s.writer_name}?`)) return;
    const { error } = await supabase.from("spotlights").delete().eq("id", s.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["spotlights"] });
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
