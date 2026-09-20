import { Link, useParams, Navigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { stories, featuredChain } from "@/lib/life-data";
import { Badge, Button } from "@/components/ui";

const reasons = [
  "same artist · recorded listening habit",
  "same location / platform · device cluster",
  "temporal proximity · date window",
  "repeated category pattern across archive"
];

export function StoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const story = stories.find(s => s.slug === slug);
  const [selected, setSelected] = useState(2);

  if (!story) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="display text-5xl">Story not found</h1>
          <p className="mt-4 text-sm text-muted-foreground">This chapter doesn't exist in the archive.</p>
          <Link to="/stories" className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[.12em]">
            <ArrowLeft className="h-4 w-4" /> Back to stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link to="/stories" className="mb-10 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        All stories
      </Link>
      <header className="max-w-4xl">
        <p className="eyebrow">
          {story.kicker} · {story.range}
        </p>
        <h1 className="display mt-5 text-6xl leading-[.9] sm:text-8xl">{story.title}</h1>
        <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground">{story.summary}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {story.categories.map(c => (
            <Badge key={c}>{c}</Badge>
          ))}
          <Badge>{story.count.toLocaleString("en-IN")} moments</Badge>
        </div>
      </header>

      <section className="relative mt-14 min-h-[560px] overflow-hidden rounded-lg border border-border bg-card/50 p-5 sm:p-10">
        <div className="absolute left-1/2 top-16 h-[430px] w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
        <p className="eyebrow relative z-10 text-center">A sequence from the chapter</p>
        <div className="relative z-10 mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-5 md:items-center">
          {featuredChain.map((r, i) => (
            <div key={r.id} className={`relative ${i % 2 ? "md:translate-y-20" : "md:-translate-y-6"}`}>
              <button
                onClick={() => setSelected(i)}
                aria-label={`Open ${r.title}`}
                className={`mx-auto grid h-16 w-16 place-items-center rounded-full border bg-background text-xl transition duration-500 ${
                  selected === i
                    ? `scale-110 border-${r.tone} text-${r.tone} shadow-lg`
                    : `border-border text-muted-foreground hover:border-primary`
                }`}
              >
                {r.icon}
              </button>
              <div className={`mt-4 text-center transition ${selected === i ? "opacity-100" : "opacity-50"}`}>
                <p className="text-xs font-semibold">{r.title}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{r.time}</p>
              </div>
              {i < 4 && <ArrowRight className="absolute -right-5 top-6 hidden h-4 w-4 text-primary/50 md:block" />}
            </div>
          ))}
        </div>

        <div className="glass relative z-10 mx-auto mt-28 max-w-lg rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="eyebrow">Why this moment connects</p>
              <h3 className="mt-3 text-lg font-semibold">{featuredChain[selected]?.title}</h3>
            </div>
            <span className={`text-2xl text-${featuredChain[selected]?.tone}`}>{featuredChain[selected]?.icon}</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            This moment joins the sequence through <span className="text-foreground">{reasons[selected % reasons.length]}</span>. It also belongs to a pattern repeated elsewhere in this chapter.
          </p>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap justify-between gap-4">
        <Link to="/journey">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Return to journey
          </Button>
        </Link>
        <Link to="/connections">
          <Button>
            See all connections <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
