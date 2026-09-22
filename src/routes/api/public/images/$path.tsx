import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/images/$path")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = params.path;
        if (!/^[A-Za-z0-9._-]+$/.test(path)) return new Response("Not found", { status: 404 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("poetry-images").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });
        return new Response(await data.arrayBuffer(), {
          headers: {
            "content-type": data.type || "application/octet-stream",
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
