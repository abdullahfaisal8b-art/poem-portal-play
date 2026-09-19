import { useCallback, useEffect, useMemo, useState } from "react";
import { RotateCcw, Trophy } from "lucide-react";
import { pickWord, type WordEntry } from "@/lib/words";

const MAX_MISSES = 6;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type Status = "playing" | "won" | "lost";

export function WordGame() {
  const [entry, setEntry] = useState<WordEntry | null>(null);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [shake, setShake] = useState(false);
  const [streak, setStreak] = useState(0);
  const [wins, setWins] = useState(0);

  // Pick the first word on the client only so the page never mismatches on load.
  useEffect(() => {
    setEntry(pickWord());
  }, []);

  const word = entry?.word ?? "";
  const misses = useMemo(
    () => [...guessed].filter((l) => !word.includes(l)),
    [guessed, word],
  );
  const status: Status = useMemo(() => {
    if (!word) return "playing";
    if (word.split("").every((l) => guessed.has(l))) return "won";
    if (misses.length >= MAX_MISSES) return "lost";
    return "playing";
  }, [word, guessed, misses]);

  const guess = useCallback(
    (letter: string) => {
      if (status !== "playing" || guessed.has(letter) || !word) return;
      const next = new Set(guessed);
      next.add(letter);
      setGuessed(next);
      if (!word.includes(letter)) {
        setShake(true);
        setTimeout(() => setShake(false), 400);
      }
    },
    [status, guessed, word],
  );

  // Track score once when a round ends.
  useEffect(() => {
    if (status === "won") {
      setWins((w) => w + 1);
      setStreak((s) => s + 1);
    } else if (status === "lost") {
      setStreak(0);
    }
  }, [status]);

  // Keyboard support.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const k = e.key.toUpperCase();
      if (LETTERS.includes(k)) guess(k);
      if (e.key === "Enter" && status !== "playing") newRound();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function newRound() {
    setEntry(pickWord(word));
    setGuessed(new Set());
  }

  if (!entry) {
    return <p className="text-center text-muted-foreground">Shuffling the dictionary…</p>;
  }

  const livesLeft = MAX_MISSES - misses.length;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Score strip */}
      <div className="mb-8 flex items-center justify-between border-y border-border py-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <span>
          Wins <strong className="text-ink">{wins}</strong>
        </span>
        <span className="flex items-center gap-1.5">
          <Trophy className="size-3.5 text-gold" /> Streak{" "}
          <strong className="text-ink">{streak}</strong>
        </span>
        <span>
          Chances left{" "}
          <span className="ml-1 inline-flex gap-1 align-middle">
            {Array.from({ length: MAX_MISSES }).map((_, i) => (
              <span
                key={i}
                className={`inline-block size-2 rounded-full transition-colors ${
                  i < livesLeft ? "bg-rust" : "bg-border"
                }`}
              />
            ))}
          </span>
        </span>
      </div>

      {/* Hint */}
      <p className="eyebrow text-center">Hint</p>
      <p className="mt-2 text-center font-display text-2xl italic md:text-3xl">{entry.hint}</p>

      {/* Word tiles */}
      <div
        className={`mt-10 flex flex-wrap justify-center gap-2 md:gap-3 ${shake ? "animate-shake" : ""}`}
        aria-label="Hidden word"
      >
        {word.split("").map((l, i) => {
          const revealed = guessed.has(l) || status === "lost";
          const missed = status === "lost" && !guessed.has(l);
          return (
            <span
              key={i}
              className={`flex h-14 w-10 items-end justify-center border-b-2 pb-1 font-display text-4xl md:h-16 md:w-12 md:text-5xl ${
                missed ? "border-rust text-rust" : "border-ink"
              }`}
            >
              {revealed ? <span className="animate-tile-pop inline-block">{l}</span> : ""}
            </span>
          );
        })}
      </div>

      {/* Result */}
      <div className="mt-8 min-h-16 text-center">
        {status === "won" && (
          <p className="animate-fade-up font-display text-3xl">
            Beautiful — <em className="text-moss">{word}</em> it is.
          </p>
        )}
        {status === "lost" && (
          <p className="animate-fade-up font-display text-3xl">
            The word was <em className="text-rust">{word}</em>. Try another.
          </p>
        )}
        {status !== "playing" && (
          <button
            onClick={newRound}
            className="mt-4 inline-flex items-center gap-2 bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-foreground transition-colors hover:bg-rust"
          >
            <RotateCcw className="size-4" /> Next word
          </button>
        )}
      </div>

      {/* Keyboard */}
      <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-2">
        {LETTERS.map((l) => {
          const used = guessed.has(l);
          const hit = used && word.includes(l);
          return (
            <button
              key={l}
              onClick={() => guess(l)}
              disabled={used || status !== "playing"}
              className={`h-11 w-9 border font-sans text-sm font-semibold transition-all md:w-10 ${
                !used
                  ? "border-ink bg-card hover:-translate-y-0.5 hover:bg-ink hover:text-ink-foreground"
                  : hit
                    ? "border-moss bg-moss text-ink-foreground"
                    : "border-border bg-muted text-muted-foreground line-through"
              } disabled:cursor-default`}
            >
              {l}
            </button>
          );
        })}
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Tip: you can type letters on your keyboard. Press Enter for the next word.
      </p>
    </div>
  );
}
