import { createFileRoute } from "@tanstack/react-router";
import { CLUB_NAME } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import { WordGame } from "@/components/game/WordGame";
import { PoetryPuzzle } from "@/components/game/PoetryPuzzle";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/game")({
  head: () => ({
    meta: [
      { title: `Poetry Games — ${CLUB_NAME}` },
      {
        name: "description",
        content: "Play poetry word games: guess the hidden word or solve a word scramble puzzle.",
      },
      { property: "og:title", content: `Poetry Games — ${CLUB_NAME}` },
      { property: "og:description", content: "Guess hidden poetry words and solve word scramble puzzles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GamePage,
});

function GamePage() {
  const [game, setGame] = useState<"guess" | "puzzle">("guess");
  return (
    <>
      <PageHeader
        eyebrow="Games"
        title="Play with words"
        intro="A little poetry between the lines. Pick a game and see what you can solve."
      />
      <div className="px-5">
        <div className="mx-auto mb-10 flex w-fit border border-ink" role="tablist" aria-label="Choose a game">
          <Button role="tab" aria-selected={game === "guess"} onClick={() => setGame("guess")} variant={game === "guess" ? "default" : "ghost"} className="rounded-none px-5 sm:px-8">Guess the word</Button>
          <Button role="tab" aria-selected={game === "puzzle"} onClick={() => setGame("puzzle")} variant={game === "puzzle" ? "default" : "ghost"} className="rounded-none px-5 sm:px-8">Word puzzle</Button>
        </div>
        <div role="tabpanel">{game === "guess" ? <WordGame /> : <PoetryPuzzle />}</div>
      </div>
    </>
  );
}
