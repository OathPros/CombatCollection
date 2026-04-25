import type { RollResult } from "@/lib/combat/types";
import { DescriptionCard } from "@/components/description-card";
import { EmptyState } from "@/components/empty-state";

export function DescriptionResults({ results, hasRolled }: { results: RollResult[]; hasRolled: boolean }) {
  if (!hasRolled) {
    return <EmptyState title="Ready to strike" description="Choose your loadout and click Roll to Attack." />;
  }

  if (results.length === 0) {
    return <EmptyState title="No matching descriptions" description="Adjust weapon or attribute filters and roll again." />;
  }

  return (
    <section className="grid gap-3 md:grid-cols-2">
      {results.map((result) => (
        <DescriptionCard key={result.description.id} result={result} />
      ))}
    </section>
  );
}
