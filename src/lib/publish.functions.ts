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

const newsInput = z.object({
  title: z.string().min(1),
  summary: z.string(),
  body: z.string(),
  published: z.boolean(),
});
const spotlightInput = z.object({
  writer_name: z.string().min(1),
  headline: z.string(),
  bio: z.string(),
  poem_title: z.string(),
  poem: z.string().min(1),
  published: z.boolean(),
});
const eventInput = z.object({
  title: z.string().min(1),
  description: z.string(),
  event_date: z.string().min(1),
  event_time: z.string(),
  location: z.string(),
  published: z.boolean(),
});

const tableSchema = z.enum(["news", "spotlights", "events"]);
type Table = z.infer<typeof tableSchema>;
const inputFor = { news: newsInput, spotlights: spotlightInput, events: eventInput } as const;
const orderFor: Record<Table, string> = {
  news: "published_at",
  spotlights: "featured_at",
  events: "event_date",
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
    return rows as (Tables<"news"> | Tables<"spotlights"> | Tables<"events">)[];
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
