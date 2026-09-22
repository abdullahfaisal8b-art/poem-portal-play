import { Link } from "@tanstack/react-router";
import { Feather, Menu, X } from "lucide-react";
import { useState } from "react";
import { CLUB_NAME } from "@/lib/queries";

const links = [
  { to: "/", label: "Home" },
  { to: "/spotlight", label: "Writers Spotlight" },
  { to: "/news", label: "Daily News" },
  { to: "/events", label: "Events" },
  { to: "/game", label: "Word Game" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Feather className="size-5 text-rust" />
          <span className="font-display text-2xl leading-none">{CLUB_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="nav-link" activeOptions={{ exact: l.to === "/" }}>
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-5 border-t border-border px-5 py-6 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="nav-link"
              activeOptions={{ exact: l.to === "/" }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
