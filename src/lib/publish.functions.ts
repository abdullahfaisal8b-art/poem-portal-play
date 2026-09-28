import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import type { Tables } from "@/integrations/supabase/types";

// ---- Gate -----------------------------------------------------------------

type GateSession = { unlocked?: boolean };

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "publish-gate",
    maxAge: 60 * 60 * 24 * 30,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function passwordMatches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireUnlocked() {
  const session = await useSession<GateSession>(sessionConfig());
  if (!session.data.unlocked) throw new Error("Locked");
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const unlockPublishing = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ password: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env["PUBLISH_PASSWORD"];
    if (!expected) throw new Error("Publishing password is not configured yet.");
    if (!passwordMatches(data.password, expected)) return { ok: false as const };
    const session = await useSession<GateSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const lockPublishing = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<GateSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const getPublishStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<GateSession>(sessionConfig());
  return { unlocked: !!session.data.unlocked };
});

// ---- Content management (all gated) ---------------------------------------

const image = z.string().nullable().optional();

const newsInput = z.object({
  title: z.string().min(1),
  summary: z.string(),
  body: z.string(),
  published: z.boolean(),
  image_path: image,
});
const spotlightInput = z.object({
  writer_name: z.string().min(1),
  headline: z.string(),
  bio: z.string(),
  poem_title: z.string(),
  poem: z.string().min(1),
  published: z.boolean(),
  image_path: image,
});
const eventInput = z.object({
  title: z.string().min(1),
  description: z.string(),
  event_date: z.string().min(1),
  event_time: z.string(),
  location: z.string(),
  published: z.boolean(),
  image_path: image,
});
const cornerInput = z.object({
  kind: z.enum(["book", "note"]),
  title: z.string().min(1),
  body: z.string(),
  month: z.string(),
  published: z.boolean(),
});

const MAX_BYTES = 8 * 1024 * 1024;
const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export const uploadImage = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        fileName: z.string().min(1).max(200),
        contentType: z.string().min(1),
        dataBase64: z.string().min(1),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    await requireUnlocked();
    if (!allowedTypes.includes(data.contentType)) throw new Error("That file type isn't supported.");
    const bytes = Buffer.from(data.dataBase64, "base64");
    if (bytes.byteLength > MAX_BYTES) throw new Error("That picture is larger than 8 MB.");
    const ext = (data.fileName.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${crypto.randomUUID()}.${ext || "jpg"}`;
    const db = await admin();
    const { error } = await db.storage
      .from("poetry-images")
      .upload(path, bytes, { contentType: data.contentType, upsert: false });
    if (error) throw new Error(error.message);
    return { path };
  });

const tableSchema = z.enum(["news", "spotlights", "events", "corner"]);
type Table = z.infer<typeof tableSchema>;
const inputFor = {
  news: newsInput,
  spotlights: spotlightInput,
  events: eventInput,
  corner: cornerInput,
} as const;
const orderFor: Record<Table, string> = {
  news: "published_at",
  spotlights: "featured_at",
  events: "event_date",
  corner: "created_at",
};

export const adminList = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ table: tableSchema }).parse(d))
  .handler(async ({ data }) => {
    await requireUnlocked();
    const db = await admin();
    const { data: rows, error } = await db
      .from(data.table)
      .select("*")
      .order(orderFor[data.table], { ascending: data.table === "events" });
    if (error) throw new Error(error.message);
    return rows as (
      | Tables<"news">
      | Tables<"spotlights">
      | Tables<"events">
      | Tables<"corner">
    )[];
  });

export const adminSave = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({ table: tableSchema, id: z.string().uuid().optional(), values: z.unknown() })
      .parse(d),
  )
  .handler(async ({ data }) => {
    await requireUnlocked();
    const values = inputFor[data.table].parse(data.values);
    const db = await admin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = db.from(data.table) as any;
    const { error } = data.id
      ? await t.update(values).eq("id", data.id)
      : await t.insert(values);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminDelete = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ table: tableSchema, id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    await requireUnlocked();
    const db = await admin();
    const { error } = await db.from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

// ---- Submissions (public form, gated review) -------------------------------

const submissionInput = z.object({
  writer_name: z.string().trim().min(2, "Please tell us your name.").max(80),
  title: z.string().trim().max(120),
  work_type: z.enum(["poem", "short story", "essay", "artwork"]),
  body: z.string().trim().min(10, "Please include the work itself.").max(6000),
  note: z.string().trim().max(300),
  // Hidden field real people never fill in; bots do, and the entry is dropped.
  website: z.string().max(0).optional(),
});

export const submitWork = createServerFn({ method: "POST" })
  .inputValidator((d) => submissionInput.parse(d))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true as const };
    const db = await admin();
    const { error } = await db.from("submissions").insert({
      writer_name: data.writer_name,
      title: data.title,
      work_type: data.work_type,
      body: data.body,
      note: data.note,
      status: "new",
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminListSubmissions = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ status: z.enum(["new", "approved", "declined"]).optional() }).parse(d))
  .handler(async ({ data }) => {
    await requireUnlocked();
    const db = await admin();
    let query = db.from("submissions").select("*").order("created_at", { ascending: false });
    if (data.status) query = query.eq("status", data.status);
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return rows as Tables<"submissions">[];
  });

export const adminSetSubmissionStatus = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({ id: z.string().uuid(), status: z.enum(["new", "approved", "declined"]) })
      .parse(d),
  )
  .handler(async ({ data }) => {
    await requireUnlocked();
    const db = await admin();
    const { error } = await db
      .from("submissions")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminDeleteSubmission = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    await requireUnlocked();
    const db = await admin();
    const { error } = await db.from("submissions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/** Send an accepted submission straight into the Writers' Spotlight page. */
export const adminPublishSubmission = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    await requireUnlocked();
    const db = await admin();
    const { data: row, error: readError } = await db
      .from("submissions")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (readError) throw new Error(readError.message);
    if (!row) throw new Error("That submission is no longer here.");

    const { error } = await db.from("spotlights").insert({
      writer_name: row.writer_name,
      headline: row.note || `Sent in as a ${row.work_type}.`,
      bio: "",
      poem_title: row.title,
      poem: row.body,
      published: true,
    });
    if (error) throw new Error(error.message);

    const { error: statusError } = await db
      .from("submissions")
      .update({ status: "approved" })
      .eq("id", data.id);
    if (statusError) throw new Error(statusError.message);
    return { ok: true as const };
  });
