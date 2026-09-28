import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CLUB_NAME } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import { WordGame } from "@/components/game/WordGame";
import { PoetryPuzzle } from "@/components/game/PoetryPuzzle";
import { CompleteTheLine } from "@/components/game/CompleteTheLine";
import { RhymeMatch } from "@/components/game/RhymeMatch";
import { VerseUnscramble } from "@/components/game/VerseUnscramble";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/interactive")({
  head: () => ({
    meta: [
      { title: `Interactive — ${CLUB_NAME}` },
      {
        name: "description",
        content:
          "Play five poetry games: guess the hidden word, solve a scramble, complete a famous line, match rhymes and rebuild a verse.",
      },
      { property: "og:title", content: `Interactive — ${CLUB_NAME}` },
      {
        property: "og:description",
        content: "Five poetry games: word guesses, scrambles, famous lines and rhymes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InteractivePage,
});

const GAMES = [
  { id: "guess", label: "Guess the word", hint: "Uncover a poetry term letter by letter." },
  { id: "puzzle", label: "Word puzzle", hint: "Unscramble the letters into a poetry word." },
  { id: "line", label: "Complete the line", hint: "Fill the missing word in a famous verse." },
  { id: "rhyme", label: "Rhyme match", hint: "Turn cards over and pair the rhyming words." },
  { id: "verse", label: "Verse unscramble", hint: "Put a shuffled poem line back in order." },
] as const;

type GameId = (typeof GAMES)[number]["id"];

function InteractivePage() {
  const [game, setGame] = useState<GameId>("guess");
  const current = GAMES.find((g) => g.id === game)!;

  return (
    <>
      <PageHeader
        eyebrow="Interactive"
        title="Play with words"
        intro="Five little ways to sharpen a poet's ear. Pick one and see how far you get."
      />
      <div className="px-5">
        <div
          className="mx-auto mb-3 flex w-fit max-w-full flex-wrap justify-center gap-0 border border-ink"
          role="tablist"
          aria-label="Choose a game"
        >
          {GAMES.map((g) => (
            <Button
              key={g.id}
              role="tab"
              aria-selected={game === g.id}
              onClick={() => setGame(g.id)}
              variant={game === g.id ? "default" : "ghost"}
              className="rounded-none px-4 text-xs sm:px-6 sm:text-sm"
            >
              {g.label}
            </Button>
          ))}
        </div>
        <p className="mx-auto mb-10 max-w-md text-center text-sm text-muted-foreground">
          {current.hint}
        </p>
        <div role="tabpanel">
          {game === "guess" && <WordGame />}
          {game === "puzzle" && <PoetryPuzzle />}
          {game === "line" && <CompleteTheLine />}
          {game === "rhyme" && <RhymeMatch />}
          {game === "verse" && <VerseUnscramble />}
        </div>
      </div>
    </>
  );
}
