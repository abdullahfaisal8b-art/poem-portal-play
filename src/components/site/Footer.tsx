import { Link } from "@tanstack/react-router";
import { CLUB_NAME, CLUB_TAGLINE } from "@/lib/queries";

export function Footer() {
  return (
    <footer className="rule-double mt-24">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-10 md:flex-row md:items-center">
        <div>
          <p className="font-display text-2xl">{CLUB_NAME}</p>
          <p className="text-sm text-muted-foreground">{CLUB_TAGLINE}</p>
        </div>
        <nav className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <Link to="/spotlight" className="hover:text-ink">
            Spotlight
          </Link>
          <Link to="/news" className="hover:text-ink">
            News
          </Link>
          <Link to="/events" className="hover:text-ink">
            Events
          </Link>
          <Link to="/game" className="hover:text-ink">
            Game
          </Link>
          <Link to="/publish" className="hover:text-ink">
            Publish
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {CLUB_NAME}. Words belong to their writers.
        </p>
      </div>
    </footer>
  );
}
