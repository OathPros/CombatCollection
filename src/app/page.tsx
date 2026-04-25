import { AppShell } from "@/components/app-shell";
import { CharacterTabs } from "@/components/character-tabs";
import { loadCombatData } from "@/lib/combat/load-data";

export default async function HomePage() {
  const data = await loadCombatData();

  return (
    <AppShell>
      <CharacterTabs data={data} initialCharacters={[]} />
    </AppShell>
  );
}
