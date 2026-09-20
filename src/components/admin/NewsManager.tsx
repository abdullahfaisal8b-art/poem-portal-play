import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { newsQuery, type News } from "@/lib/queries";
import { formatDate } from "@/components/site/PageHeader";
import { Checkbox, Field, FormShell, ItemRow, TextArea, TextInput } from "./fields";

const empty = { title: "", summary: "", body: "", published: true };

export function NewsManager() {
  const qc = useQueryClient();
  const { data } = useQuery(newsQuery);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<News | null>(null);
  const [busy, setBusy] = useState(false);

  function startEdit(n: News) {
    setEditing(n);
    setForm({ title: n.title, summary: n.summary, body: n.body, published: n.published });
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
      ? await supabase.from("news").update(form).eq("id", editing.id)
      : await supabase.from("news").insert(form);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editing ? "News updated" : "News published");
    reset();
    qc.invalidateQueries({ queryKey: ["news"] });
  }

  async function remove(n: News) {
    if (!confirm(`Delete "${n.title}"?`)) return;
    const { error } = await supabase.from("news").delete().eq("id", n.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["news"] });
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
