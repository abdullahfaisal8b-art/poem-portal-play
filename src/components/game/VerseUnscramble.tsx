import { useMemo, useState } from "react";
import { ArrowLeft, Check, RotateCcw, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VERSES, shuffle } from "@/lib/games";

export function VerseUnscramble() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * VERSES.length));
  const [picked, setPicked] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);

  const verse = VERSES[index]!;
  const tiles = useMemo(() => shuffle(verse.words.map((word, i) => ({ word, i }))), [index]);

  const answer = picked.map((i) => verse.words[i]).join(" ");
  const isCorrect = picked.length === verse.words.length && answer === verse.words.join(" ");

  function take(i: number) {
    if (picked.includes(i) || solved) return;
    setPicked((p) => [...p, i]);
    setChecked(false);
  }

  function undo() {
    if (solved) return;
    setPicked((p) => p.slice(0, -1));
    setChecked(false);
  }

  function check() {
    if (isCorrect) {
      setSolved(true);
      setScore((s) => s + 1);
    } else {
      setChecked(true);
    }
  }

  function next() {
    let i = index;
    while (i === index) i = Math.floor(Math.random() * VERSES.length);
    setIndex(i);
    setPicked([]);
    setChecked(false);
    setSolved(false);
  }

  function reshuffle() {
    next();
  }

  return (
    <div className="paper-card mx-auto max-w-3xl p-8 md:p-10">
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow">Verse unscramble</p>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Solved {score}</p>
      </div>

      <p className="mt-6 max-w-lg text-sm text-muted-foreground">
        These words came from a famous poem and lost their order. Tap them in the right sequence
        to rebuild the line.
      </p>

      <div className="mt-8 min-h-20 border border-dashed border-ink/40 bg-card p-4">
        {picked.length === 0 ? (
          <p className="text-sm italic text-muted-foreground">Your line will appear here…</p>
        ) : (
          <p className="flex flex-wrap gap-2 font-display text-2xl">
            {picked.map((i, position) => (
              <button
                key={`${i}-${position}`}
                onClick={undo}
                disabled={solved}
                title="Remove the last word"
                className="border-b border-rust px-1 hover:text-rust"
              >
                {verse.words[i]}
              </button>
            ))}
          </p>
        )}
      </div>

      {checked && !solved && (
        <p className="mt-4 text-sm text-destructive">
          Not quite — that isn't the line. Tap the last word to take it back.
        </p>
      )}
      {solved && (
        <p className="mt-4 text-sm text-moss">
          Correct — {verse.source} wrote it that way.
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {tiles.map(({ word, i }) => (
          <Button
            key={i}
            variant={picked.includes(i) ? "secondary" : "outline"}
            size="sm"
            disabled={picked.includes(i) || solved}
            onClick={() => take(i)}
            className="rounded-none font-display text-lg"
          >
            {word}
          </Button>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {verse.words.length} words
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" size="sm" onClick={undo} disabled={!picked.length || solved} className="rounded-none">
            <ArrowLeft className="size-3.5" /> Undo
          </Button>
          <Button variant="outline" size="sm" onClick={reshuffle} className="rounded-none">
            <Shuffle className="size-3.5" /> Other verse
          </Button>
          {solved ? (
            <Button size="sm" onClick={next} className="rounded-none">
              Next verse
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={check}
              disabled={picked.length !== verse.words.length}
              className="rounded-none"
            >
              <Check className="size-3.5" /> Check line
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={next} className="rounded-none">
            <RotateCcw className="size-3.5" /> Skip
          </Button>
        </div>
      </div>
    </div>
  );
}
