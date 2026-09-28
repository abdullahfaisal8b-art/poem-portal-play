import { Link } from "@tanstack/react-router";
import { CLUB_NAME, CLUB_TAGLINE, NAV_LINKS } from "@/lib/queries";
import bcpLogo from "@/assets/bcp-logo.png.asset.json";

export function Footer() {
  return (
    <footer className="rule-double mt-24">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-10 md:flex-row md:items-center">
        <div>
          <p className="font-display text-2xl">{CLUB_NAME}</p>
          <p className="text-sm text-muted-foreground">{CLUB_TAGLINE}</p>
          <img
            src={bcpLogo.url}
            alt="Beacon House College Programme"
            className="mt-5 h-9 w-auto"
            width={1149}
            height={366}
          />
        </div>
        <nav className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {NAV_LINKS.filter((l) => l.to !== "/").map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-ink">
              {l.label}
            </Link>
          ))}
          <Link to="/archive" className="hover:text-ink">
            Archive
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
