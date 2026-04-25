import { loadCombatData } from "@/lib/combat/load-data";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";

export default async function LibraryPage() {
  const data = await loadCombatData();

  return (
    <AppShell>
      <div className="rounded-xl border border-zinc-700 bg-panel/90 p-4">
        <h2 className="mb-4 font-serif text-2xl text-parchment">Description Library</h2>
        {!data.descriptions.length ? (
          <EmptyState title="No descriptions loaded" description="Populate /data/descriptions.json to browse content." />
        ) : (
          <ul className="space-y-2">
            {data.descriptions.map((d) => (
              <li key={d.id} className="rounded border border-zinc-700 p-3 text-sm">
                <p className="font-semibold text-zinc-100">{d.title}</p>
                <p className="text-zinc-300">{d.body}</p>
                <p className="text-xs text-zinc-400">{d.author}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
