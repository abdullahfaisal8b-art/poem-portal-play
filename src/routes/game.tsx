import { createFileRoute, Link, redirect } from "@tanstack/react-router";

/** The old games address — the games now live under Interactive. */
export const Route = createFileRoute("/game")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex" }],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/interactive", replace: true });
  },
  component: MovedPage,
});

function MovedPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <p className="eyebrow">Moved</p>
      <h1 className="mt-3 text-4xl">The games are now under Interactive</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        If you aren't redirected automatically, use the link below.
      </p>
      <Link
        to="/interactive"
        className="mt-8 inline-block bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-foreground hover:bg-rust"
      >
        Go to Interactive
      </Link>
    </div>
  );
}
