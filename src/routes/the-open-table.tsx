import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/the-open-table")({
  head: () => ({
    meta: [
      { title: "The Open Table | Outside Catering Specialists" },
      {
        name: "description",
        content:
          "The Open Table — outside catering specialists. Professional catering for weddings, corporate events and private functions.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TheOpenTablePage,
});

function TheOpenTablePage() {
  return (
    <iframe
      src="/the-open-table.html"
      title="The Open Table — Outside Catering Specialists"
      className="h-[100dvh] w-full border-0"
    />
  );
}
