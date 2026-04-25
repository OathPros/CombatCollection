"use client";

import { useEffect, useMemo, useState } from "react";
import type { RollResult } from "@/lib/combat/types";
import { DescriptionCard } from "@/components/description-card";
import { EmptyState } from "@/components/empty-state";

export function DescriptionResults({
  results,
  allResults,
  hasRolled
}: {
  results: RollResult[];
  allResults: RollResult[];
  hasRolled: boolean;
}) {
  const [showAll, setShowAll] = useState(false);
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setShowAll(false);
    setUsedIds(new Set());
  }, [results]);

  const activeResults = useMemo(() => (showAll ? allResults : results), [allResults, results, showAll]);

  if (!hasRolled) {
    return <EmptyState title="Ready to strike" description="Choose your loadout and click Roll to Attack." />;
  }

  if (activeResults.length === 0) {
    return <EmptyState title="No matching descriptions" description="Adjust weapon or attribute filters and roll again." />;
  }

  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        {activeResults.map((result) => (
          <DescriptionCard
            key={result.description.id}
            result={result}
            used={usedIds.has(result.description.id)}
            onUsedChange={(nextValue) =>
              setUsedIds((prev) => {
                const next = new Set(prev);
                if (nextValue) {
                  next.add(result.description.id);
                } else {
                  next.delete(result.description.id);
                }
                return next;
              })
            }
          />
        ))}
      </div>

      {!showAll && allResults.length > results.length ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="rounded border border-zinc-600 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-900"
          >
            Show all ({allResults.length})
          </button>
        </div>
      ) : null}
    </section>
  );
}
