import { createFileRoute, Link, redirect } from "@tanstack/react-router";

/** The old address for the news page — it now lives under Campus. */
export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex" }],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/campus", replace: true });
  },
  component: MovedPage,
});

function MovedPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <p className="eyebrow">Moved</p>
      <h1 className="mt-3 text-4xl">This page is now Campus</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        If you aren't redirected automatically, use the link below.
      </p>
      <Link
        to="/campus"
        className="mt-8 inline-block bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-foreground hover:bg-rust"
      >
        Go to Campus
      </Link>
    </div>
  );
}
