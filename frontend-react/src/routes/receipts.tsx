import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { receipts, type Category } from "@/lib/life-data";
import { Button, PageIntro, SearchField } from "@/components/ui";
import { ReceiptArtifact } from "@/components/visuals";

const cats = ["All", "Music", "Places", "Purchases", "Entertainment", "Events", "Photos", "Messages", "Searches", "Notes"] as const;

export function Receipts() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [limit, setLimit] = useState(24);
  const [selected, setSelected] = useState<(typeof receipts)[number] | null>(null);

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim();
    return receipts.filter(r => {
      const matchesCat = cat === "All" || r.category === cat;
      const matchesSearch =
        !query ||
        `${r.title} ${r.location} ${r.detail} ${r.dataset} ${r.category}`.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
  }, [q, cat]);

  const list = useMemo(() => filtered.slice(0, limit), [filtered, limit]);

  const nearbyEvidence = useMemo(() => {
    if (!selected) return { sameDate: 0, sameLocation: 0, sameCategory: 0 };
    const sameDate = receipts.filter(r => r.id !== selected.id && r.date === selected.date).length;
    const sameLocation = receipts.filter(r => r.id !== selected.id && r.location === selected.location).length;
    const sameCategory = receipts.filter(r => r.id !== selected.id && r.category === selected.category).length;
    return { sameDate, sameLocation, sameCategory };
  }, [selected]);

  return (
    <div>
      <PageIntro
        eyebrow="162,588 artifacts · 3 datasets"
        title="Every fragment leaves a trace."
        copy="Search the raw moments behind every story, then follow any receipt into the relationships around it."
      />

      <div className="sticky top-0 z-20 -mx-5 mt-8 border-y border-border bg-background/90 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
        <div className="flex flex-col gap-3 xl:flex-row">
          <SearchField
            value={q}
            onChange={e => {
              setQ(e.target.value);
              setLimit(24);
            }}
            placeholder="Search moments, artists, merchants, places, or words…"
            className="xl:max-w-md"
          />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {cats.map(c => (
              <Button
                variant={cat === c ? "primary" : "ghost"}
                onClick={() => {
                  setCat(c);
                  setLimit(24);
                }}
                key={c}
                className="shrink-0"
              >
                {c}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {list.map(r => (
          <ReceiptArtifact key={r.id} receipt={r} onClick={() => setSelected(r)} />
        ))}
      </div>

      {limit < filtered.length && (
        <div className="mt-10 text-center">
          <Button variant="outline" onClick={() => setLimit(prev => prev + 24)}>
            Load more moments ({filtered.length - limit} remaining)
          </Button>
        </div>
      )}

      {!filtered.length && (
        <div className="py-24 text-center">
          <p className="display text-4xl">No fragments surfaced.</p>
          <p className="mt-3 text-sm text-muted-foreground">Try another phrase or category.</p>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end bg-background/60 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <aside
            onClick={e => e.stopPropagation()}
            className="h-[86vh] w-full overflow-y-auto border-l border-border bg-card p-7 shadow-2xl sm:max-w-md"
          >
            <div className="flex justify-between">
              <p className="eyebrow">Receipt detail · {selected.id}</p>
              <Button variant="icon" onClick={() => setSelected(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className={`mt-12 text-6xl text-${selected.tone}`}>{selected.icon}</div>
            <h2 className="display mt-7 text-5xl leading-none">{selected.title}</h2>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              {selected.detail}. Captured on {selected.date} at {selected.time}, near {selected.location}. This moment belongs to {selected.dataset}.
            </p>
            <div className="mt-10 border-y border-border py-5">
              <p className="eyebrow">Nearby evidence</p>
              <p className="mt-3 text-sm">{nearbyEvidence.sameDate} moments occurred on the same date ({selected.date})</p>
              <p className="mt-2 text-sm">{nearbyEvidence.sameLocation} moments share this location/platform ({selected.location})</p>
              <p className="mt-2 text-sm">{nearbyEvidence.sameCategory} total moments in category {selected.category}</p>
            </div>
            <div className="mt-8 grid gap-3">
              <Link to="/connections">
                <Button className="w-full">View connections</Button>
              </Link>
              <Link to="/journey">
                <Button variant="outline" className="w-full">Explore timeline</Button>
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
