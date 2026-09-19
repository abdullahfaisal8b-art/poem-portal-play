import { createFileRoute } from "@tanstack/react-router";
import { CLUB_NAME } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import { WordGame } from "@/components/game/WordGame";

export const Route = createFileRoute("/game")({
  head: () => ({
    meta: [
      { title: `Word Game — ${CLUB_NAME}` },
      {
        name: "description",
        content: "Guess the letters and complete the poetry word before you run out of chances.",
      },
      { property: "og:title", content: `Word Game — ${CLUB_NAME}` },
      { property: "og:description", content: "Complete the hidden poetry word." },
    ],
  }),
  component: GamePage,
});

function GamePage() {
  return (
    <>
      <PageHeader
        eyebrow="Word Game"
        title="Complete the word"
        intro="A hidden poetry term. Guess letters, fill the blanks, and don't run out of chances."
      />
      <div className="px-5">
        <WordGame />
      </div>
    </>
  );
}
