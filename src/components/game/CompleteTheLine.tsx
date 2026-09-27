import { useMemo, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LINES } from "@/lib/games";

export function CompleteTheLine() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * LINES.length));
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const entry = LINES[index];
  const options = useMemo(() => shuffleLocal(entry.options), [index]);

  const answered = chosen !== null;

  function choose(option: string) {
    if (answered) return;
    setChosen(option);
    if (option === entry.answer) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  }

  function go(nextIndex: number) {
    setIndex(nextIndex);
    setChosen(null);
  }

  function next() {
    let i = index;
    while (i === index) i = Math.floor(Math.random() * LINES.length);
    go(i);
  }

  function reset() {
    setScore(0);
    setStreak(0);
    go(Math.floor(Math.random() * LINES.length));
  }

  return (
    <div className="paper-card mx-auto max-w-3xl p-8 md:p-10">
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow">Complete the line</p>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Score {score} · Streak {streak}
        </p>
      </div>

      <p className="mt-8 font-display text-3xl leading-snug md:text-4xl">
        {entry.prompt.split("___")[0]}
        <span className="mx-2 inline-block min-w-24 border-b-2 border-rust px-2 text-center italic text-rust">
          {answered ? entry.answer : "?"}
        </span>
        {entry.prompt.split("___")[1]}
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const isAnswer = option === entry.answer;
          const isChosen = option === chosen;
          const tone = !answered
            ? "border-ink hover:bg-ink hover:text-ink-foreground"
            : isAnswer
              ? "border-moss bg-moss/10 text-moss"
              : isChosen
                ? "border-destructive bg-destructive/10 text-destructive"
                : "border-border text-muted-foreground";
          return (
            <button
              key={option}
              onClick={() => choose(option)}
              disabled={answered}
              className={`flex items-center justify-between border px-5 py-3 text-left font-display text-xl transition-colors ${tone}`}
            >
              {option}
              {answered && isAnswer && <Check className="size-4" />}
              {answered && isChosen && !isAnswer && <X className="size-4" />}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {answered ? entry.source : "Who wrote it?"}
        </p>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={reset} className="rounded-none">
            <RotateCcw className="size-3.5" /> Reset score
          </Button>
          <Button size="sm" onClick={next} className="rounded-none">
            {answered ? "Next line" : "Skip"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function shuffleLocal(items: string[]): string[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
