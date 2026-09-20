import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui";
import { MiniSignal } from "@/components/visuals";
import type { stories } from "@/lib/life-data";

type Story = (typeof stories)[number];

export function StoryCard({ story, large = false }: { story: Story; large?: boolean }) {
  return (
    <article
      className={`group glass relative overflow-hidden rounded-lg p-6 transition duration-500 hover:-translate-y-1 hover:border-primary/40 ${
        large ? "md:col-span-2 md:grid md:grid-cols-[1.2fr_.8fr] md:gap-10 md:p-9" : ""
      }`}
    >
      <div>
        <div className="flex items-center justify-between">
          <p className="eyebrow">{story.kicker}</p>
          <span className={`text-${story.accent}`}>
            <MiniSignal tone={story.accent} />
          </span>
        </div>
        <h2 className="display mt-6 text-4xl leading-none sm:text-5xl">{story.title}</h2>
        <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">{story.summary}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {story.categories.map(c => (
            <Badge key={c} tone={c.toLowerCase()}>
              {c}
            </Badge>
          ))}
        </div>
        <Link
          to={`/stories/${story.slug}`}
          className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-foreground"
        >
          Explore story <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      </div>
      <div className="mt-8 flex items-end justify-between border-t border-border pt-6 md:mt-0 md:flex-col md:items-end md:justify-between md:border-l md:border-t-0 md:pl-8">
        <div className="text-right">
          <span className={`display text-6xl text-${story.accent}`}>{story.stat}</span>
          <span className="block max-w-36 text-xs text-muted-foreground">{story.label}</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-foreground">{story.range}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[.12em] text-muted-foreground">{story.count.toLocaleString("en-IN")} connected moments</p>
        </div>
      </div>
    </article>
  );
}
