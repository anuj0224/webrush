import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { insights } from "@/lib/life-data";
import { PageIntro } from "@/components/ui";
import { MiniSignal } from "@/components/visuals";

export function Insights() {
  return (
    <div>
      <PageIntro
        eyebrow="Patterns & insights"
        title="What kept returning."
        copy="Observations are only as strong as their evidence. Every pattern here opens back into the moments that support it."
      />
      <div className="mt-12 divide-y divide-border border-y border-border">
        {insights.map(x => (
          <article key={x.n} className="group grid gap-6 py-10 sm:grid-cols-[80px_minmax(0,1fr)_160px] sm:items-center">
            <span className={`display text-5xl text-${x.tone}`}>{x.n}</span>
            <div>
              <p className="eyebrow">{x.tag}</p>
              <h2 className="display mt-3 text-3xl sm:text-4xl">{x.title}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">{x.copy}</p>
              <Link to="/receipts" className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[.12em]">
                View source moments <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="text-right">
              <MiniSignal tone={x.tone} />
              <strong className={`display mt-2 block text-3xl text-${x.tone}`}>{x.metric}</strong>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
