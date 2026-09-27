import { useCallback, useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RHYMES, shuffle } from "@/lib/games";

type Tile = { key: string; word: string; pair: number };

function newRound(): Tile[] {
  const pairs = shuffle(RHYMES).slice(0, 6);
  const tiles: Tile[] = pairs.flatMap(([a, b], pair) => [
    { key: `${pair}a`, word: a, pair },
    { key: `${pair}b`, word: b, pair },
  ]);
  return shuffle(tiles);
}

export function RhymeMatch() {
  const [tiles, setTiles] = useState<Tile[]>(() => newRound());
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);

  const won = matched.length === 6;

  const flip = useCallback(
    (tile: Tile) => {
      if (lock || matched.includes(tile.pair) || flipped.includes(tile.key)) return;
      const next = [...flipped, tile.key];
      setFlipped(next);
      if (next.length < 2) return;

      setMoves((m) => m + 1);
      const [first, second] = next;
      const a = tiles.find((t) => t.key === first)!;
      const b = tiles.find((t) => t.key === second)!;
      setLock(true);
      window.setTimeout(() => {
        if (a.pair === b.pair) {
          setMatched((m) => [...m, a.pair]);
        }
        setFlipped([]);
        setLock(false);
      }, 650);
    },
    [flipped, lock, matched, tiles],
  );

  function restart() {
    setTiles(newRound());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLock(false);
  }

  useEffect(() => {
    if (!won) return;
    const t = window.setTimeout(() => setFlipped([]), 0);
    return () => window.clearTimeout(t);
  }, [won]);

  return (
    <div className="paper-card mx-auto max-w-3xl p-8 md:p-10">
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow">Rhyme match</p>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {matched.length} / 6 pairs · {moves} {moves === 1 ? "move" : "moves"}
        </p>
      </div>

      <p className="mt-6 max-w-lg text-sm text-muted-foreground">
        Turn over two cards and find the words that rhyme. Six pairs are hidden in the grid.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {tiles.map((tile) => {
          const faceUp = flipped.includes(tile.key) || matched.includes(tile.pair);
          const done = matched.includes(tile.pair);
          return (
            <button
              key={tile.key}
              onClick={() => flip(tile)}
              aria-label={faceUp ? tile.word : "Hidden word"}
              className={`flex h-20 items-center justify-center border px-2 text-center font-display text-lg transition-colors md:text-xl ${
                done
                  ? "border-moss bg-moss/10 text-moss"
                  : faceUp
                    ? "border-ink bg-paper-deep text-ink"
                    : "border-border bg-card text-transparent hover:border-ink"
              }`}
            >
              {faceUp ? tile.word : "?"}
            </button>
          );
        })}
      </div>

      {won && (
        <p className="mt-8 text-center font-display text-2xl italic">
          All six pairs found in {moves} moves.
        </p>
      )}

      <div className="mt-8 flex justify-center border-t border-border pt-6">
        <Button variant="outline" size="sm" onClick={restart} className="rounded-none">
          <RotateCcw className="size-3.5" /> New round
        </Button>
      </div>
    </div>
  );
}
