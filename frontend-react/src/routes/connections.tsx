import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { featuredChain } from "@/lib/life-data";
import { Badge, Button, PageIntro } from "@/components/ui";

const positions = [
  [17, 32],
  [39, 18],
  [62, 41],
  [42, 70],
  [79, 68]
];

export function Connections() {
  const [active, setActive] = useState(2);
  const r = featuredChain[active] ?? featuredChain[0];
  const origin = positions[active] ?? positions[0];

  const connectionReason = useMemo(() => {
    if (!r) return "";
    const otherReceipts = featuredChain.filter((_, i) => i !== active);
    const sameArtist = otherReceipts.find(o => o.rawArtist && o.rawArtist === r.rawArtist);
    const sameLocation = otherReceipts.find(o => o.location === r.location);
    const sameCategory = otherReceipts.find(o => o.category === r.category);

    if (sameArtist) {
      return `These moments connect through a shared artist (${r.rawArtist}) recorded across listening sessions.`;
    }
    if (sameLocation) {
      return `These moments connect through a shared location/platform (${r.location}) recorded in the dataset.`;
    }
    if (sameCategory) {
      return `These moments connect through recurring activity in the ${r.category} category.`;
    }
    return `These moments share temporal proximity in the dataset.`;
  }, [r, active]);

  if (!r || !origin) return null;

  return (
    <div>
      <PageIntro
        eyebrow="Connection field · 1,499 locations & 162,588 moments"
        title="Nothing happened alone."
        copy="Select a moment to follow its nearest relationships. Every line is explained by time, place, or repetition in the archive."
      />

      <div className="mt-10 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="relative min-h-[620px] overflow-hidden rounded-lg border border-border bg-card/40">
          <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-2">
            <Badge>All categories</Badge>
            <Badge>Temporal proximity</Badge>
          </div>
          <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
            {positions.map((p, i) =>
              i !== active ? (
                <line
                  key={i}
                  x1={`${origin[0]}%`}
                  y1={`${origin[1]}%`}
                  x2={`${p[0]}%`}
                  y2={`${p[1]}%`}
                  stroke="var(--primary)"
                  strokeOpacity=".38"
                  strokeWidth="1"
                  className="flow-line"
                />
              ) : null
            )}
            <circle cx="50%" cy="50%" r="120" fill="none" stroke="var(--line)" />
            <circle cx="50%" cy="50%" r="230" fill="none" stroke="var(--line)" />
          </svg>

          {featuredChain.map((x, i) => {
            const point = positions[i] ?? positions[0];
            if (!point) return null;
            return (
              <button
                key={x.id}
                onClick={() => setActive(i)}
                style={{ left: `${point[0]}%`, top: `${point[1]}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition duration-500 ${
                  active === i ? "z-10 scale-110" : "opacity-70 hover:opacity-100"
                }`}
              >
                <span
                  className={`grid h-16 w-16 place-items-center rounded-full border bg-background text-xl text-${x.tone} ${
                    active === i ? `border-${x.tone} category-dot` : "border-border"
                  }`}
                >
                  {x.icon}
                </span>
                <span className="mt-3 block max-w-36 text-center text-[10px] text-foreground">{x.title}</span>
              </button>
            );
          })}
        </section>

        <aside className="glass rounded-lg p-7">
          <p className="eyebrow">Selected moment</p>
          <div className={`mt-8 text-5xl text-${r.tone}`}>{r.icon}</div>
          <h2 className="display mt-5 text-4xl">{r.title}</h2>
          <p className="mt-3 text-xs text-muted-foreground">
            {r.date} · {r.time}
            <br />
            {r.location}
          </p>

          <div className="my-8 border-y border-border py-6">
            <p className="eyebrow">Why these connect</p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{connectionReason}</p>
          </div>

          <div className="space-y-3">
            {featuredChain
              .filter((_, i) => i !== active)
              .slice(0, 3)
              .map(x => (
                <button
                  onClick={() => setActive(featuredChain.indexOf(x))}
                  key={x.id}
                  className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border p-3 text-left hover:bg-secondary"
                >
                  <span className={`text-${x.tone}`}>{x.icon}</span>
                  <span className="truncate text-xs">{x.title}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </button>
              ))}
          </div>

          <Link to="/receipts" className="mt-8 block">
            <Button variant="outline" className="w-full">
              Open receipt
            </Button>
          </Link>
        </aside>
      </div>
    </div>
  );
}
