import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CLUB_NAME } from "@/lib/queries";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: `Members Sign In — ${CLUB_NAME}` },
      { name: "description", content: "Sign in to publish news, spotlights and events." },
      { property: "og:title", content: `Members Sign In — ${CLUB_NAME}` },
      { property: "og:description", content: "Sign in to manage the poetry club website." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/admin", replace: true });
  }, [user, loading, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/auth" },
        });
        if (error) throw error;
        if (!data.session) {
          setCheckEmail(true);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    "w-full border-b border-ink bg-transparent py-2 font-display text-xl outline-none placeholder:text-muted-foreground focus:border-rust";

  return (
    <div className="mx-auto max-w-md px-5 pt-16">
      <p className="eyebrow">Members</p>
      <h1 className="mt-3 text-5xl">{mode === "signin" ? "Sign in" : "Create account"}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Only the club's creator can publish. Visitors don't need an account to read.
      </p>

      {checkEmail ? (
        <div className="paper-card mt-10 p-8">
          <p className="font-display text-2xl">Check your inbox.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a confirmation link to <strong>{email}</strong>. Click it, then come back and
            sign in.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="paper-card mt-10 space-y-6 p-8">
          <label className="block">
            <span className="eyebrow">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              placeholder="you@college.edu"
            />
          </label>
          <label className="block">
            <span className="eyebrow">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-foreground transition-colors hover:bg-rust disabled:opacity-50"
          >
            {busy ? "One moment…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="w-full text-center text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-ink"
          >
            {mode === "signin" ? "First time? Create the account" : "Already have an account? Sign in"}
          </button>
        </form>
      )}
    </div>
  );
}
