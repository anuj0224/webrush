import { stories } from "@/lib/life-data";
import { PageIntro } from "@/components/ui";
import { StoryCard } from "@/components/story-card";

export function Stories() {
  return (
    <div>
      <PageIntro
        eyebrow={`${stories.length} chapters discovered`}
        title="Stories, found between the moments."
        copy="Each chapter is an observation grounded in visible dates, locations, proximity, and repetition—not an assumption about how it felt."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {stories.map((s, i) => (
          <StoryCard key={s.slug} story={s} large={i === 0} />
        ))}
      </div>
    </div>
  );
}
