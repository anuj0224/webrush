import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { activity, months, receipts } from "@/lib/life-data";
import { Button, PageIntro } from "@/components/ui";
import { LifePulse, ReceiptArtifact } from "@/components/visuals";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Journey — Life, In Receipts" },
      { name: "description", content: "Move across a year of activity signals, clusters, and connected moments." },
      { property: "og:title", content: "The Journey — Life, In Receipts" },
      { property: "og:description", content: "An expressive map of a digital life across time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ]
  }),
  component: Journey
});

function Journey() {
  const [month, setMonth] = useState(5);
  const [zoom, setZoom] = useState(1);

  const monthReceipts = useMemo(() => {
    return receipts.filter(r => {
      const monthIdx = parseInt(r.date.slice(5, 7), 10) - 1;
      return monthIdx === month;
    });
  }, [month]);

  const monthHighlights = useMemo(() => {
    const musicCount = monthReceipts.filter(r => r.category === "Music").length;
    const purchaseCount = monthReceipts.filter(r => r.category === "Purchases").length;
    const placesCount = monthReceipts.filter(r => r.category === "Places").length;
    const entCount = monthReceipts.filter(r => r.category === "Entertainment").length;

    const highlights: string[] = [];
    if (musicCount > 0) highlights.push(`${musicCount} music listening sessions recorded`);
    if (purchaseCount > 0) highlights.push(`${purchaseCount} transaction and purchase receipts logged`);
    if (placesCount > 0) highlights.push(`${placesCount} location and travel moments identified`);
    if (entCount > 0) highlights.push(`${entCount} entertainment entries captured`);

    return highlights.length ? highlights : ["Active streaming and transaction logging across this period"];
  }, [monthReceipts]);

  const displayedReceipts = useMemo(() => {
    return monthReceipts.slice(0, 6);
  }, [monthReceipts]);

  return (
    <div>
      <PageIntro
        eyebrow="A year in signals"
        title="The journey is not a straight line."
        copy="Move through rises, pauses, and clusters. Select any month to reveal the moments and patterns carrying its signal."
        aside={
          <div className="flex gap-2">
            <Button variant="icon" onClick={() => setZoom(Math.max(0.8, zoom - 0.1))} aria-label="Zoom out">
              <Minus className="h-4 w-4" />
            </Button>
            <Button variant="icon" onClick={() => setZoom(Math.min(1.4, zoom + 0.1))} aria-label="Zoom in">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <section className="mt-10 overflow-x-auto rounded-lg border border-border bg-card/40 p-6">
        <div style={{ width: `${zoom * 100}%`, minWidth: 760 }}>
          <LifePulse onSelect={setMonth} />
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
        <section>
          <p className="eyebrow">Selected period</p>
          <h2 className="display mt-3 text-6xl text-primary">{months[month]}</h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {monthReceipts.length} recorded moments formed in {months[month]} across datasets. Listening and transaction activity created distinct signals during this period.
          </p>
          <div className="mt-7 space-y-3">
            {monthHighlights.map(x => (
              <div className="w-full border-l border-primary/40 py-2 pl-4 text-left text-sm text-foreground" key={x}>
                {x}
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {displayedReceipts.map(r => (
            <ReceiptArtifact key={r.id} receipt={r} />
          ))}
        </section>
      </div>
    </div>
  );
}
