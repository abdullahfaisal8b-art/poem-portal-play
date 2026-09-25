import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { CLUB_NAME } from "@/lib/queries";
import crest from "@/assets/crest.png";
...
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={crest} alt="Literary Society crest" className="size-10 object-contain" width={816} height={816} />
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
