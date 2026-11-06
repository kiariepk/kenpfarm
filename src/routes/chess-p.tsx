import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chess-p")({
  head: () => ({
    meta: [
      { title: "Endgame · A Chess App" },
      {
        name: "description",
        content: "Endgame — play chess against the computer, with puzzles and full game rules.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ChessPage,
});

function ChessPage() {
  return (
    <iframe
      src="/chess-p.html"
      title="Endgame — A Chess App"
      className="h-[100dvh] w-full border-0"
    />
  );
}
