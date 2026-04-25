import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { loadCombatData } from "@/lib/combat/load-data";

export default async function AdminDescriptionsPage() {
  const data = await loadCombatData();

  return (
    <AppShell>
      <div className="rounded-xl border border-zinc-700 bg-panel/90 p-4">
        <h2 className="mb-4 font-serif text-2xl text-parchment">Admin: Descriptions</h2>
        {!data.descriptions.length ? (
          <EmptyState title="No descriptions loaded" description="Seed data to view rows." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-700 text-zinc-200">
                  <th>title</th>
                  <th>attribute</th>
                  <th>motion</th>
                  <th>range</th>
                  <th>profileIds</th>
                  <th>status</th>
                  <th>sourceRow</th>
                </tr>
              </thead>
              <tbody>
                {data.descriptions.map((d) => (
                  <tr key={d.id} className="border-b border-zinc-800">
                    <td>{d.title}</td>
                    <td>{d.attribute}</td>
                    <td>{d.motion}</td>
                    <td>{d.range ?? "-"}</td>
                    <td>{d.profileIds.join(",")}</td>
                    <td>{d.status}</td>
                    <td>{d.sourceRow ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
