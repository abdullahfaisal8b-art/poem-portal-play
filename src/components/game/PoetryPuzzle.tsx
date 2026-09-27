import { useEffect, useState } from "react";
import { ArrowLeft, RotateCcw, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pickWord, type WordEntry } from "@/lib/words";

type Tile = { id: number; letter: string };

function shuffleWord(word: string): Tile[] {
  const tiles = word.split("").map((letter, id) => ({ id, letter }));
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  if (tiles.map((tile) => tile.letter).join("") === word && tiles.length > 1) {
    const different = tiles.findIndex((tile) => tile.letter !== tiles[0].letter);
    if (different > 0) [tiles[0], tiles[different]] = [tiles[different], tiles[0]];
  }
  return tiles;
}

export function PoetryPuzzle() {
  const [entry, setEntry] = useState<WordEntry | null>(null);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    const first = pickWord();
    setEntry(first);
    setTiles(shuffleWord(first.word));
  }, []);

  function newPuzzle() {
    const next = pickWord(entry?.word);
    setEntry(next);
    setTiles(shuffleWord(next.word));
    setPicked([]);
    setSolved(false);
    setFeedback("");
  }

  function choose(id: number) {
    if (solved || picked.includes(id)) return;
    setPicked((current) => [...current, id]);
    setFeedback("");
  }

  function undo() {
    if (solved) return;
    setPicked((current) => current.slice(0, -1));
    setFeedback("");
  }

  function check() {
    if (!entry || picked.length !== tiles.length || solved) return;
    const answer = picked.map((id) => tiles.find((tile) => tile.id === id)?.letter).join("");
    if (answer === entry.word) {
      setSolved(true);
      setScore((current) => current + 1);
      setFeedback("Exactly right!");
    } else {
      setFeedback("Not quite. Try moving the letters around.");
    }
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLElement && event.target.closest("input, textarea, [contenteditable]")) return;
      if (event.key === "Backspace") {
        event.preventDefault();
        undo();
      } else if (event.key === "Enter") {
        if (solved) newPuzzle();
        else check();
      } else if (/^[a-z]$/i.test(event.key) && !solved) {
        const tile = tiles.find((item) => item.letter === event.key.toUpperCase() && !picked.includes(item.id));
        if (tile) choose(tile.id);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!entry) return <p className="text-center text-muted-foreground">Preparing your puzzle…</p>;

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <div className="mb-8 flex items-center justify-between border-y border-border py-3 text-xs font-semibold uppercase text-muted-foreground">
        <span>Word scramble</span>
        <span>Solved <strong className="text-ink">{score}</strong></span>
      </div>

      <p className="eyebrow text-center">Clue</p>
      <p className="mt-2 text-center font-display text-2xl italic md:text-3xl">{entry.hint}</p>

      <div className="mt-10 flex min-h-16 flex-wrap items-center justify-center gap-1.5 sm:gap-2" aria-label="Your answer">
        {entry.word.split("").map((_, index) => {
          const tile = tiles.find((item) => item.id === picked[index]);
          return (
            <span key={index} className={`flex size-9 items-center justify-center border-b-2 font-display text-2xl sm:size-11 sm:text-3xl ${solved ? "border-moss text-moss" : "border-ink"}`}>
              {tile?.letter ?? ""}
            </span>
          );
        })}
      </div>

      <p className={`mt-5 min-h-7 text-center text-sm ${solved ? "text-moss" : "text-rust"}`} role="status" aria-live="polite">{feedback}</p>

      <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Scrambled letters">
        {tiles.map((tile) => (
          <Button
            key={tile.id}
            type="button"
            variant="outline"
            onClick={() => choose(tile.id)}
            disabled={picked.includes(tile.id) || solved}
            aria-label={`Choose ${tile.letter}`}
            className="size-10 rounded-none border-ink bg-card p-0 font-display text-2xl shadow-none sm:size-12"
          >
            {tile.letter}
          </Button>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {solved ? (
          <Button type="button" onClick={newPuzzle} className="rounded-none px-6 uppercase">Next puzzle <RotateCcw /></Button>
        ) : (
          <>
            <Button type="button" variant="outline" onClick={undo} disabled={picked.length === 0} className="rounded-none" title="Remove last letter" aria-label="Remove last letter"><ArrowLeft /></Button>
            <Button type="button" variant="outline" onClick={() => { setTiles(shuffleWord(entry.word)); setPicked([]); setFeedback(""); }} className="rounded-none" title="Shuffle letters" aria-label="Shuffle letters"><Shuffle /></Button>
            <Button type="button" onClick={check} disabled={picked.length !== tiles.length} className="rounded-none px-7 uppercase">Check word</Button>
          </>
        )}
      </div>
    </div>
  );
}