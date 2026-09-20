import { Pencil, Trash2 } from "lucide-react";

const base =
  "w-full border border-input bg-card px-3 py-2 text-sm outline-none focus:border-rust focus:ring-1 focus:ring-rust";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-1 block">{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={base} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${base} min-h-28`} />;
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 accent-rust"
      />
      {label}
    </label>
  );
}

export function FormShell({
  title,
  onSubmit,
  onCancel,
  busy,
  editing,
  children,
}: {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  busy: boolean;
  editing: boolean;
  children: React.ReactNode;
}) {
  return (
    <form onSubmit={onSubmit} className="paper-card space-y-5 p-6">
      <h2 className="text-2xl">{editing ? `Edit ${title}` : `New ${title}`}</h2>
      {children}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="bg-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink-foreground transition-colors hover:bg-rust disabled:opacity-50"
        >
          {busy ? "Saving…" : editing ? "Save changes" : "Publish"}
        </button>
        {editing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border border-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-muted"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export function ItemRow({
  title,
  meta,
  published,
  onEdit,
  onDelete,
}: {
  title: string;
  meta: string;
  published: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <li className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="truncate font-display text-xl">
          {title}{" "}
          {!published && (
            <span className="ml-2 align-middle font-sans text-[10px] uppercase tracking-widest text-rust">
              Draft
            </span>
          )}
        </p>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{meta}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={onEdit}
          aria-label="Edit"
          className="border border-border p-2 hover:border-ink"
        >
          <Pencil className="size-4" />
        </button>
        <button
          onClick={onDelete}
          aria-label="Delete"
          className="border border-border p-2 text-destructive hover:border-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </li>
  );
}
