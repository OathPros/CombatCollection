import { TagBadge } from "@/components/tag-badge";
import type { RollResult } from "@/lib/combat/types";

export function DescriptionCard({ result }: { result: RollResult }) {
  const badge = result.resultSource === "primary" ? "1" : result.resultSource === "secondary" ? "2" : null;
  return (
    <article className="rounded-lg bg-parchment p-4 text-zinc-900 shadow-lg">
      <header className="mb-2 flex items-center justify-between">
        <h3 className="font-serif text-lg">{result.description.title}</h3>
        {badge ? <span className="rounded-full border border-zinc-600 px-2 py-0.5 text-xs">{badge}</span> : null}
      </header>
      {result.description.bodyHtml ? (
        <p className="text-sm" dangerouslySetInnerHTML={{ __html: result.description.bodyHtml }} />
      ) : (
        <p className="text-sm">{result.description.body}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-1">
        {result.description.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
      <p className="mt-2 text-xs text-zinc-700">By {result.description.author}</p>
    </article>
  );
}
