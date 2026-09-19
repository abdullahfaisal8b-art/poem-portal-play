import { Link, useNavigate } from "@tanstack/react-router";
import { Feather, Menu, X } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
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
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

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
          {user ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link to="/admin" className="nav-link">
                  Publish
                </Link>
              )}
              <button onClick={signOut} className="nav-link cursor-pointer">
                Sign out
              </button>
            </div>
          ) : (
            <Link to="/auth" className="nav-link">
              Sign in
            </Link>
          )}
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
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="nav-link" onClick={() => setOpen(false)}>
                  Publish
                </Link>
              )}
              <button onClick={signOut} className="nav-link w-fit cursor-pointer">
                Sign out
              </button>
            </>
          ) : (
            <Link to="/auth" className="nav-link" onClick={() => setOpen(false)}>
              Sign in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
